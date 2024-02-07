"use client";

import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VirtualCharacter } from "@/types/virtualCharacter";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  virtualCharacters: VirtualCharacter[];
  setVirtualCharacters: Dispatch<SetStateAction<VirtualCharacter[]>>;
}

export default function ({ setVirtualCharacters }: Props) {
  const { user, fetchUserInfo } = useContext(AppContext);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [virtualCharacter, setVirtualCharacter] =
    useState<VirtualCharacter | null>(null);
  const [useText, setUseText] = useState(true);
  const router = useRouter();

  const requestGenVirtualCharacter = async function () {
    try {
      const uri = "/api/gen-virtual-character";
      const params = {
        description: description,
      };

      setLoading(true);
      const resp = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(params),
      });
      setLoading(false);

      if (resp.status === 401) {
        toast.error("Please Sign In");
        router.push("/sign-in");
        return;
      }
      console.log("gen virtualCharacter resp", resp);

      if (resp.ok) {
        const { code, message, data } = await resp.json();
        if (code !== 0) {
          toast.error(message);
          return;
        }
        if (data && data.img_url) {
          fetchUserInfo();

          setDescription("");

          const virtualCharacter: VirtualCharacter = data;
          setVirtualCharacter(virtualCharacter);
          setVirtualCharacters((virtualCharacters: VirtualCharacter[]) => [
            virtualCharacter,
            ...virtualCharacters,
          ]);

          toast.success("gen virtualCharacter ok");
          return;
        }
      }

      toast.error("gen virtualCharacter failed");
    } catch (e) {
      console.log("search failed: ", e);
      toast.error("gen virtualCharacter failed");
    }
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const switchTab = function () {};

  const handleSubmit = function () {
    if (!description) {
      toast.error("invalid image description");
      inputRef.current?.focus();
      return;
    }

    if (!user) {
      toast.error("please sign in");
      return;
    }

    if (user.credits && user.credits.left_credits < 1) {
      toast.error("credits not enough");
      return;
    }

    requestGenVirtualCharacter();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <form
        className="flex w-full flex-col gap-3 sm:flex-row"
        onSubmit={() => {
          return false;
        }}
      >
        <Tabs defaultValue="text" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="photo">Photo</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <Input
              type="file"
              // className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </TabsContent>
          <TabsContent value="photo">
            <Input
              type="text"
              placeholder="virtualCharacter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleInputKeydown}
              disabled={loading}
              ref={inputRef}
            />
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
