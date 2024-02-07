import Image from "next/image";

export default function () {
  return (
    <section className="relatve">
      <div className="mx-auto max-w-7xl px-5 py-4 md:px-10 md:py-4 lg:py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-primary text-4xl font-semibold md:text-6xl">
            AI Character Generation
          </h1>
          <p className="mx-auto mb-5 max-w-[528px] text-xl text-[#636262] lg:mb-8">
            Generate AI characters for your game, movie, or any other project
          </p>
        </div>
      </div>
      <Image
        src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg"
        width={200}
        height={200}
        alt=""
        className="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto"
      />
      <Image
        src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg"
        width={200}
        height={200}
        alt=""
        className="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block"
      />
    </section>
  );
}
