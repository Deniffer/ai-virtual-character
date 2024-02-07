import { respData, respErr } from "@/lib/resp"
import { getVirtualCharacters } from "@/models/virtualCharater";

export async function POST(req: Request) {
    try {
        const { page } = await req.json();
        const virtualCharacters = await getVirtualCharacters(page || 1, 100);
    
        return respData(virtualCharacters);
      } catch (e) {
        console.log("get virtual character failed: ", e);
        return respErr("get virtual character failed");
      }
}
