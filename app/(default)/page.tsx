"use client"
import Hero from "@/components/hero";
import Input from "@/components/input";
import VirtualCharacters from "@/components/virtualCharacters";
import { VirtualCharacter } from "@/types/virtualCharacter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function () {

  const [virturalCharacters, setVirturalCharacters] = useState<VirtualCharacter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVirtualCharacters = async function (page:number) {
    try {
      const uri = "api/get-virtual-characters";
      const params = {
        page: page,
        limit: 10,
      };
      setLoading(true);

      const resp = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(params),
      })

      setLoading(false);

      if (resp.ok) {
        const data = await resp.json();
        console.log(data.data)
        setVirturalCharacters(data.data);
      } else {
        console.log("fetch virtual characters failed");
        toast.error("fetch virtual characters failed");
      }

    } catch(e) {
      console.log("get virtual failed: ", e);
      toast.error("get wallpapers failed");
    }
  }

  useEffect(() => {
    fetchVirtualCharacters(1);
  }, [])

  return (
    <div>
      <Hero />
      <div className="mx-auto my-4 flex max-w-lg justify-center">
          <Input virtualCharacters={virturalCharacters} setVirtualCharacters={setVirturalCharacters} />
        </div>
      <VirtualCharacters virturalCharacters={virturalCharacters} loading={loading}/>
    </div>
  );
}
