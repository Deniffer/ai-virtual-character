import { respData, respErr } from "@/lib/resp";

import { ImageGenerateParams } from "openai/resources/images.mjs";
import { User } from "@/types/user";
import { VirtualCharacter } from "@/types/virtualCharacter";
import { currentUser } from "@clerk/nextjs";
import { downloadAndUploadImage } from "@/lib/s3";
import { getOpenAIClient } from "@/services/openai";
import { saveUser } from "@/services/user";
import { insertvirtualCharacter } from "@/models/virtualCharater";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }

  try {
    const { description } = await req.json();
    if (!description) {
      return respErr("invalid params");
    }
    console.log("description: ", description)
    // setup user
    const user_email = user.emailAddresses[0].emailAddress;
    const nickname = user.firstName;
    const avatarUrl = user.imageUrl;
    const userInfo: User = {
      email: user_email,
      nickname: nickname || "",
      avatar_url: avatarUrl,
    };

    await saveUser(userInfo);

    const client = getOpenAIClient();

    const llm_name = "dall-e-3";
    const img_size = "1024x1024";
    const llm_params: ImageGenerateParams = {
      prompt: `generate a virtual character image about ${description}`,
      model: llm_name,
      n: 1,
      quality: "hd",
      response_format: "url",
      size: img_size,
      style: "vivid",
    };

    const created_at = new Date().toISOString();

    const result = await client.images.generate(llm_params);
    console.log("result: ", result.data[0].url)
    const raw_img_url = result.data[0].url;
    if (!raw_img_url) {
      return respErr("generate wallpaper failed");
    }

    const img_name = encodeURIComponent(description);
    const s3_img = await downloadAndUploadImage(
      raw_img_url,
      process.env.AWS_BUCKET || "ai-virtual-character-deniffer",
      `virtualCharacter/${img_name}.png`
    );
    const img_url = s3_img.Location;
    console.log("lwq +",img_url);
    const virtualCharacter: VirtualCharacter = {
      user_email: user_email,
      img_description: description,
      img_size: img_size,
      img_url: img_url,
      llm_name: llm_name,
      llm_params: JSON.stringify(llm_params),
      created_at: created_at,
    };
    await insertvirtualCharacter(virtualCharacter);

    return respData(virtualCharacter);
  } catch (e) {
    console.log("generate virtual character failed: ", e);
    return respErr("generate virtual character failed");
  }
}
