export const parseNLInput = (input) => {
  const text = input.toLowerCase().trim();
  
  // Detect algorithm
  let algorithm = null;
  if (text.includes("bubble")) 
    algorithm = "bubble-sort";
  else if (text.includes("selection")) 
    algorithm = "selection-sort";
  else if (text.includes("insertion")) 
    algorithm = "insertion-sort";
  else if (text.includes("merge")) 
    algorithm = "merge-sort";
  else if (text.includes("quick")) 
    algorithm = "quick-sort";
  else if (text.includes("linear search") || 
           text.includes("linear")) 
    algorithm = "linear-search";
  else if (text.includes("binary search") || 
           text.includes("binary")) 
    algorithm = "binary-search";
  else if (text.includes("stack")) 
    algorithm = "stack";
  else if (text.includes("queue")) 
    algorithm = "queue";
  else if (text.includes("linked list") || 
           text.includes("linked")) 
    algorithm = "linked-list";
  else if (text.includes("sort")) 
    algorithm = "bubble-sort";
  else if (text.includes("search")) 
    algorithm = "linear-search";

  // Stronger array detection
  // Catches: [2,3,4,5,1] or 2,3,4,5,1 
  // or [2, 3, 4, 5, 1] or 2 3 4 5 1
  let array = null;
  
  // Pattern 1: numbers inside brackets [1,2,3]
  const bracketMatch = input.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    const parsed = bracketMatch[1]
      .split(/[,\s]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 999);
    if (parsed.length >= 2 && parsed.length <= 12) {
      array = parsed;
    }
  }
  
  // Pattern 2: sequence of numbers without brackets
  // like "sort 5 3 8 1 9"
  if (!array) {
    const numberMatches = input.match(/\b\d+\b/g);
    if (numberMatches && numberMatches.length >= 2) {
      const parsed = numberMatches
        .map(n => parseInt(n))
        .filter(n => n > 0 && n <= 999);
      if (parsed.length >= 2 && parsed.length <= 12) {
        array = parsed;
      }
    }
  }

  console.log("Parsed algorithm:", algorithm);
  console.log("Parsed array:", array);
  
  return { algorithm, array };
};
