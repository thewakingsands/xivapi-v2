export function GET() {
  return new Response(JSON.stringify({
    next: "docs only environment fake response",
    schema: "fake@pretendies",
    results: [
      {
        score: 0.5,
        sheet: "Item",
        row_id: 37362,
        fields: {
          Icon: {
            id: 51474,
            path: "ui/icon/051000/051474.tex",
            path_hr1: "ui/icon/051000/051474_hr1.tex"
          },
          Name: "Ironworks Tool Set",
          Singular: "Ironworks tool set"
        }
      },
    ]
  }))
}
