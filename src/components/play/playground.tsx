import { useId, useLayoutEffect, useRef, useState } from "preact/hooks"
import {
  stringifyQuery,
  type Group,
} from "./query";
import { Editor } from "./editor";
import styles from './playground.module.css'
import { CopyIcon, SendHorizontalIcon } from "lucide-preact";
import type { JSX } from "preact/jsx-runtime";
import { highlight } from "./highlight";

export function SearchPlayground() {
  const [sheets, setSheets] = useState<string>('')

  const [root, setRoot] = useState<Group>([])

  const [response, setResponse] = useState<string>()

  const stringified = encodeURIComponent(stringifyQuery(root));
  const url = `/api/search?sheets=${sheets}&query=${stringified}`

  const abortController = useRef<AbortController>()
  const onSend = () => {
    if (abortController.current != null) {
      abortController.current.abort()
    }

    const controller = new AbortController();
    abortController.current = controller;
    fetch(url, { signal: controller.signal })
      .then(response => response.json())
      .then(
        response => {
          abortController.current = undefined
          setResponse(JSON.stringify(response, undefined, 2))
        },
        error => {
          // This will presumably be from aborts, log and squash.
          console.error('rejected', error)
        }
      )
  }
  const onCopy = () => {
    void navigator.clipboard.writeText(url)
  }

  // roumd trip go brr
  // const test = parseQuery(stringified)

  const sheetsId = useId();

  return (
    <div className={styles.playground}>
      <div className={styles.field}>
        <label for={sheetsId}>Sheets</label>
        <input
          id={sheetsId}
          type="text"
          value={sheets}
          onInput={event => setSheets(event.currentTarget.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Query</label>
        <Editor group={root} onChange={setRoot} />
      </div>

      <div className={styles.url}>
        <button
          className={styles.action}
          onClick={onSend}
        >
          Send&nbsp;<SendHorizontalIcon size="1em" />
        </button>
        <pre className={styles.preview}><code>{url}</code></pre>
        <button
          className={styles.action}
          onClick={onCopy}
        >
          Copy&nbsp;<CopyIcon size="1em" />
        </button>
      </div>

      {response && <Response response={response} />}
    </div>
  )
}

type ResponseProps = {
  response: string
}

function Response({ response }: ResponseProps) {
  const [nodes, setNodes] = useState<JSX.Element>()

  useLayoutEffect(() => {
    // Set up a timeout that renders the unhighlighted string. If highlighting
    // fails for any reason, or takes too long, this ensures _something_ is
    // rendered.
    const timeout = setTimeout(() => {
      setNodes(<>{response}</>)
    }, 250)

    void highlight(response).then(highlighted => {
      clearTimeout(timeout)
      setNodes(highlighted)
    })

    return () => clearTimeout(timeout)
  }, [response])
  
  return <pre className={styles.response}><code>{nodes}</code></pre>
}
