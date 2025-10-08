export default function OmOssPage() {
  return (
    <div className="w-full py-12">
      {/* NORYA Heading */}
      <h1 className="font-bold text-slate-900 mb-12 tracking-tight font-poppins text-[150px] lg:text-[220px] xl:text-[280px] 2xl:text-[320px] leading-none text-center md:text-left px-6 md:px-0">
        NORYA
      </h1>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 w-full">
        {/* First Image – slightly less right-focused */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/pictureTest%2Fp%C3%A5%20b%C3%A5ten%20norge%20norge.png?alt=media&token=f6648d34-cbd4-437c-bad4-e8cad7728522"
          alt="Steigen landscape"
          className="rounded-xl shadow-md object-cover object-[70%_center] w-full h-[220px] lg:h-[400px] xl:h-[600px]"
        />

        {/* Second Image */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/images%2F19471412588_af53f020f0_b%20(1).jpg?alt=media&token=df68ef6a-6b55-4bd3-9b81-5b50a9c40702"
          alt="Steigen landscape"
          className="rounded-xl shadow-md object-cover object-left w-full h-[220px] lg:h-[400px] xl:h-[600px]"
        />

        {/* Third Image */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/pictureTest%2F40583072260_67a9d9ea24_o.jpg?alt=media&token=df1e8ce9-6e36-475f-ae9b-6a45a4ccef99"
          alt="Bodøryggen ridge"
          className="rounded-xl shadow-md object-cover w-full h-[220px] lg:h-[400px] xl:h-[600px]"
        />

        {/* Fourth Image */}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/images%2Focean%20traveller%20v%C3%A5gnes%20troms%C3%B8%20northern%20spirit.jpg?alt=media&token=19828aad-263c-4cf2-9cd4-455253c5a3d7"
          alt="Lofoten islands"
          className="rounded-xl shadow-md object-cover w-full h-[220px] lg:h-[400px] xl:h-[600px]"
        />
      </div>

      {/* Text */}
      <div className="px-6 md:px-12 2xl:px-24">
        <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-slate-700 leading-relaxed mb-6 font-poppins">
          NORYA er et kreativt fellesskap dedikert til å styrke skapere i Nord-Norge. En kuratert, digital markedsplass hvor vi tror på samarbeid, historiefortelling, og digitale verktøy som bringer mennesker i nord sammen.
        </p>
        <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-slate-700 leading-relaxed font-poppins">
          Vårt mål er å bygge broer mellom kunst, teknologi og lokalsamfunn. Hver skapende stemme i Nord-Norge fortjener en vakker plattform av internasjonal kvalitet — med solide, trygge norske løsninger som treffer målgruppen vår. Det ønsker vi å være.
        </p>
      </div>
    </div>
  );
}
