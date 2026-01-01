export const calculateValue = (leftOperand: number, operator: string, rightOperand: number): number => {
  switch (operator) {
    case "ADD": case "SUB": return leftOperand + rightOperand;
    case "SUBTRACT": return leftOperand - rightOperand;
    case "MULTIPLY": case "MUL": return leftOperand * rightOperand;
    case "DIVIDE": case "DIV":
      if (rightOperand === 0) throw new Error("CANNOT_DIVIDE_BY_ZERO");
      return leftOperand / rightOperand;
    default:
      return rightOperand;
  }
};