export default function OmOss() {
  return (
    <div className="omoss-container px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight font-poppins">
       NORYA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/norland-a7730.appspot.com/o/images%2F19471412588_af53f020f0_b%20(1).jpg?alt=media&token=df68ef6a-6b55-4bd3-9b81-5b50a9c40702"
          alt="Steigen landscape"
          className="rounded-xl shadow-md object-cover w-full h-[220px]"
        />
        <img
          src="https://www.fjordtours.com/globalassets/destinations/northern-norway/lofoten/lofoten-islands-norway.jpg"
          alt="Lofoten islands"
          className="rounded-xl shadow-md object-cover w-full h-[220px]"
        />
        <img
          src="https://woodbodo.com/wp-content/uploads/2023/06/bodoryggen-hike.jpg"
          alt="Bodøryggen ridge"
          className="rounded-xl shadow-md object-cover w-full h-[220px]"
        />
      </div>

      <p className="text-lg text-slate-700 leading-relaxed mb-6 font-poppins">
        NORYA er et kreativt fellesskap dedikert til å styrke skapere i Nord-Norge. En kuratert, digital markedsplass hvor vi tror på samarbeid, historiefortelling, og digitale verktøy som bringer mennesker i nord sammen.
      </p>
      <p className="text-lg text-slate-700 leading-relaxed font-poppins">
       Vårt mål er å bygge broer mellom kunst, teknologi og lokalsamfunn. Hver skapende stemme i Nord-Norge fortjener en vakker plattform av internasjonal kvalitet — med solide, trygge norske løsninger som treffer målgruppen vår. Det ønsker vi å være.
      </p>
    </div>
  );
}