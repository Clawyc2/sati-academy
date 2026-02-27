import { createThirdwebClient } from "thirdweb";

// Tu Client ID de Thirdweb
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "d3681e01a9913e9ed35b915617927b1b";

export const client = createThirdwebClient({
  clientId,
});
