import type { JSX } from "preact"
import { useCallback } from "preact/hooks"
import {
  createClauseNode,
  createGroupNode,
  OCCUR,
  OPERATIONS,
  parseSpecifier,
  parseValue,
  type Clause,
  type Group,
  type GroupEntry,
  type Node,
  type Occur,
  type Operation,
  type Specifier,
  type Value
} from "./query";
import { mustExist, UnreachableException } from "./util";
import styles from './editor.module.css'
import clsx from "clsx";

export type EditorProps = {
  group: Group,
  onChange: (group: Group) => void
}

export function Editor({ group, onChange }: EditorProps) {
  return (
    <Group
      group={group}
      onChange={onChange}
      root={true}
    />
  )
}

type GroupProps = {
  group: Group
  root?: boolean
  onChange: (group: Group) => void
}

function Group({
  group,
  root = false,
  onChange
}: GroupProps) {
  const deleteIndex = (index: number) => onChange([
    ...group.slice(undefined, index),
    ...group.slice(index + 1),
  ])

  return (
    <div className={clsx(styles.group, !root && styles.nest)}>
      {group.map((entry, index) => (
        <div className={styles.row}>
          <Delete onClick={() => deleteIndex(index)} />
          <GroupEntry
            key={index}
            entry={entry}
            onChange={entry => {
              const newGroup = [...group]
              newGroup[index] = entry
              onChange(newGroup)
            }}
          />
        </div>
      ))}

      <div className={clsx(
        styles.actions,
        group.length > 0 && styles.padded,
      )}>
        <button
          onClick={() => onChange([...group, { occur: '', node: createClauseNode() }])}
        >
          + Clause
        </button>
        <button
          onClick={() => onChange([...group, { occur: '', node: createGroupNode() }])}
        >
          + Group
        </button>
      </div>
    </div>
  )
}

type DeleteProps = {
  disabled?: boolean,
  onClick: () => void
}

function Delete({
  onClick
}: DeleteProps) {
  return (
    <button
      className={styles.delete}
      onClick={onClick}
      aria-label="Delete query node"
    >
      <IconClose />
    </button>
  )
}

// Copied out of starlight's builtins.
const IconClose = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z" />
  </svg>
)

type GroupEntryProps = {
  entry: GroupEntry
  onChange: (entry: GroupEntry) => void
}

function GroupEntry({ entry, onChange }: GroupEntryProps) {
  return (
    <div className={styles.groupEntry}>
      <Occur occur={entry.occur} onChange={occur => onChange({ ...entry, occur })} />
      <Node node={entry.node} onChange={node => onChange({ ...entry, node })} />
    </div>
  )
}

type NodeProps = {
  node: Node
  onChange: (node: Node) => void
}

function Node({ node, onChange }: NodeProps) {
  switch (node.type) {
    case 'clause': return (
      <Clause
        clause={node.clause}
        onChange={clause => onChange({ type: 'clause', clause })}
      />
    )
    case "group": return (
      <Group
        group={node.group}
        onChange={group => onChange({ type: 'group', group })}
      />
    )
    default:
      throw new UnreachableException(node)
  }
}

const OCCUR_LABELS: Record<Occur, string> = {
  "": "SHOULD",
  "+": "MUST",
  "-": "MUST NOT"
}

const OCCUR_OPTIONS: SelectOption<Occur>[] = OCCUR
  .map(occur => ({ value: occur, label: OCCUR_LABELS[occur] }))

type OccurProps = {
  occur: Occur,
  onChange: (occur: Occur) => void
}

function Occur({ occur, onChange }: OccurProps) {
  const value = mustExist(OCCUR_OPTIONS.find(option => option.value === occur))
  return (
    <Select
      value={value}
      options={OCCUR_OPTIONS}
      onChange={option => onChange(option.value)}
    />
  )
}

type ClauseProps = {
  clause: Clause
  onChange: (clause: Clause) => void
}

function Clause({ clause, onChange }: ClauseProps) {
  return <>
    <Specifier specifier={clause.specifier} onChange={specifier => onChange({ ...clause, specifier })} />
    <Operation operation={clause.operation} onChange={operation => onChange({ ...clause, operation })} />
    <Value value={clause.value} onChange={value => onChange({ ...clause, value })} />
  </>
}

type SpecifierProps = {
  specifier: Specifier,
  onChange: (specifier: Specifier) => void
}

function Specifier({ specifier, onChange }: SpecifierProps) {
  const invalid = parseSpecifier(specifier).type == 'err'
  return (
    <input
      value={specifier}
      onInput={event => onChange(event.currentTarget.value)}
      className={clsx(styles.control, invalid && styles.invalid)}
    />
  )
}
const OPERATION_OPTIONS: SelectOption<Operation>[] = OPERATIONS
  .map(operation => ({ label: operation, value: operation }))

type OperationProps = {
  operation: Operation,
  onChange: (operation: Operation) => void
}

function Operation({ operation, onChange }: OperationProps) {
  const value = mustExist(OPERATION_OPTIONS.find(option => option.value === operation))
  return (
    <Select
      value={value}
      options={OPERATION_OPTIONS}
      onChange={option => onChange(option.value)}
    />
  )
}

type ValueProps = {
  value: Value,
  onChange: (value: Value) => void
}

function Value({ value, onChange }: ValueProps) {
  const invalid = parseValue(value).type === 'err'

  return (
    <input
      value={value}
      onInput={event => onChange(event.currentTarget.value)}
      className={clsx(styles.control, invalid && styles.invalid)}
    />
  )
}

type SelectOption<T extends string> = {
  value: T
  // TODO: would be nice to include descriptive content in the label
  label: string
}

type SelectProps<T extends string> = {
  value: SelectOption<T>,
  options: SelectOption<T>[],
  onChange: (operation: SelectOption<T>) => void
}

function Select<T extends string>({ value, options, onChange }: SelectProps<T>) {
  const onSelectChange = useCallback((event: JSX.TargetedEvent<HTMLSelectElement>) => {
    const newValue = event.currentTarget.value as T
    const newOption = mustExist(options.find(option => option.value === newValue))
    onChange(newOption)
  }, [options, onChange])

  // TODO: would be nice to include meaningful text with these, without it
  // bleeding into the idle state
  return (
    <select
      value={value.value}
      onChange={onSelectChange}
      className={styles.control}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}
