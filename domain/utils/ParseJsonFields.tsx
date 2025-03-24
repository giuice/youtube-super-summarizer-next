function parseJsonFields<T>(row: T, jsonFields: (keyof T)[]): T {
    if (!row) return row;
    
    const parsedRow = {...row};
    
    for (const field of jsonFields) {
      if (parsedRow[field] && typeof parsedRow[field] === 'string') {
        try {
          parsedRow[field] = JSON.parse(parsedRow[field] as string) as any;
        } catch (e) {
          console.error(`Failed to parse JSON for field ${String(field)}:`, e);
        }
      }
    }
    
    return parsedRow;
  }

  export default parseJsonFields;