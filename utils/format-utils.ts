export function formatFileNameAsTitle(fileName: string) {
  let withoutExtension = fileName.replace(/\.[^/.]+$/, ""); 
  withoutExtension = withoutExtension.replace(/^#+/, ""); 

 
  const firstLine = withoutExtension
    .split("\n") 
    .map((line) => line.trim()) 
    .find((line) => line.length > 0) || ""; 


  const cleanedTitle = firstLine.replace(/[\p{Emoji_Presentation}\p{Emoji}\p{So}]+/gu, "");


  const formattedTitle = cleanedTitle
    .replace(/[-_]+/g, " ") 
    .replace(/([a-z])([A-Z])/g, "$1 $2") 
    .split(" ") 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(" ") 
    .trim();

  return formattedTitle;
}


