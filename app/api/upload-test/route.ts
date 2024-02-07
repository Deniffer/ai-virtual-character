import { respOk } from "@/lib/resp";
import { downloadAndUploadImage } from "@/lib/s3";

export async function GET(req: Request) {
  let raw_img_url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-cppAGA2SI92hp79rkCgpzncj/user-LE857EZIchdv95yhhO6tRYcR/img-n11jC4PGRnU9kdMylgRwpmxi.png?st=2024-02-05T09%3A50%3A42Z&se=2024-02-05T11%3A50%3A42Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-04T16%3A37%3A42Z&ske=2024-02-05T16%3A37%3A42Z&sks=b&skv=2021-08-06&sig=FH0wafRNS9TcCxEBikSI1/R7SzwuUGIE2emDl6G069E%3D"
  const img_name = encodeURIComponent("3d风格，一个两岁的小男孩，头戴老虎帽，身穿新中式风的衣服，手里拿着桃花酥在吃");
  const s3_img = await downloadAndUploadImage(
    raw_img_url,
    process.env.AWS_BUCKET || "ai-virtual-character-deniffer",
    `virtualCharacter/${img_name}.png`
  );
  const img_url = s3_img.Location;
  console.log(img_url)

  return respOk();
}