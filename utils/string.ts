export const truncateAddress = (address: string, left = 7, right = 5, separator = "...") => 
  [address?.substring(0, left), separator, address?.substring(address?.length - right)].join("");
