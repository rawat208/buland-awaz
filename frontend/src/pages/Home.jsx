import { useState } from "react";

const events = [["15 Aug 2024","स्वतंत्रता दिवस व पौधारोपण","सेक्टर 56, गुरुग्राम"],["21 June 2024","योग एवं स्वास्थ्य शिविर","बसई गाँव, गुरुग्राम"],["05 May 2024","बच्चों के लिए शिक्षा सामग्री वितरण","सिकंदरपुर, गुरुग्राम"]];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [message, setMessage] = useState("");
  function submit(e, label, phone) {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const help = form.get("help") || "सदस्यता के लिए";
    const text = `नमस्ते, मेरा नाम ${name} है। मैं Buland Awaaz Welfare Society से ${help} जुड़ना चाहता/चाहती हूँ।`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, "_blank");
    setMessage(`धन्यवाद ${name}! आपका WhatsApp message खुल रहा है।`);
    e.target.reset();
  }
  return <div>
    <header><a className="brand" href="#home"><b>बा</b><span>Buland Awaaz <small>Welfare Society</small></span></a><button className="menu" onClick={()=>setMenu(!menu)}>☰</button><nav className={menu ? "open" : ""}><a href="#about">हमारे बारे में</a><a href="#events">कार्यक्रम</a><a href="#gallery">गैलरी</a><a href="#news">समाचार</a><a className="join-nav" href="#join">जुड़ें</a></nav></header>
    <main id="home">
      <section className="hero"><div><p className="eyebrow">Gurugram · Haryana</p><h1>हर आवाज़ बने <i>बुलंद</i></h1><p>बुलंद आवाज़ वेलफेयर सोसाइटी समाज, शिक्षा, पर्यावरण और ज़रूरतमंद परिवारों के लिए निरंतर काम कर रही है।</p><a className="button" href="#join">हमसे जुड़ें</a></div></section>
      <section id="about"><p className="eyebrow">हमारा संकल्प</p><h2>छोटे कदम, बेहतर कल</h2><p className="lead">हमारा उद्देश्य एक संवेदनशील, शिक्षित और स्वच्छ गुरुग्राम बनाना है—जहाँ हर बच्चे को अवसर और हर व्यक्ति को सम्मान मिले।</p><div className="numbers"><div><b>500+</b><span>परिवारों तक मदद</span></div><div><b>35+</b><span>सामाजिक पहल</span></div><div><b>100+</b><span>सक्रिय साथी</span></div></div></section>
      <section className="pale"><p className="eyebrow">हमारी टीम</p><h2>जो सेवा को अपना धर्म मानते हैं</h2><article className="staff"><div className="photo-placeholder">कु<small>PHOTO</small></div><div><p className="eyebrow">संस्थापक एवं समाजसेवी</p><h3>Kuldeep Hindustani</h3><p>कुलदीप हिंदुस्तानी जी बुलंद आवाज़ वेलफेयर सोसाइटी के माध्यम से गुरुग्राम में जनसेवा, युवा जागरूकता और पर्यावरण संरक्षण के कार्यों को आगे बढ़ा रहे हैं।</p><small>कुलदीप जी की वास्तविक फोटो यहाँ लगाएँ।</small></div></article></section>
      <section id="events"><p className="eyebrow">हमारे कार्यक्रम</p><h2>जमीन पर किया गया काम</h2><div className="events">{events.map(e=><article key={e[1]}><time>{e[0]}</time><div><h3>{e[1]}</h3><p>📍 {e[2]}</p></div><b>→</b></article>)}</div></section>
      <section className="gallery" id="gallery"><p className="eyebrow">यादें</p><h2>हमारी गैलरी</h2><p>सेवा, संवाद और साथ की कुछ झलकियाँ।</p><div>{["1488521787991-ed7bbaae773c","1469571486292-0ba58a3f068b","1542601906990-b4d3fb778b09","1559027615-cd4628902d4a"].map((img,i)=><img key={img} src={`https://images.unsplash.com/photo-${img}?auto=format&fit=crop&w=900&q=80`} alt={`Buland Awaaz event ${i+1}`}/>)}</div></section>
      <section id="news"><p className="eyebrow">समाचार</p><h2>बुलंद आवाज़ से जुड़ी बातें</h2><div className="cards"><article><b>नई पहल</b><h3>हरियाली के लिए मासिक पौधारोपण अभियान</h3><p>गुरुग्राम के अलग-अलग क्षेत्रों में हर महीने पौधे लगाए जा रहे हैं।</p></article><article><b>शिक्षा</b><h3>बच्चों के लिए नई पुस्तक दान मुहिम</h3><p>आपकी एक किताब किसी बच्चे की नई शुरुआत बन सकती है।</p></article><article><b>समाज सेवा</b><h3>सामुदायिक सहायता अभियान जारी</h3><p>स्वयंसेवकों के साथ मिलकर परिवारों तक सहायता पहुँचाई जा रही है।</p></article></div></section>
      <section className="forms" id="join"><div><p className="eyebrow">आपका साथ ज़रूरी है</p><h2>बदलाव का हिस्सा बनिए</h2><p>सदस्य बनकर या अपना समय देकर आप हमारे काम को और मजबूत बना सकते हैं।</p></div><div className="form-grid"><form onSubmit={e=>submit(e,"सदस्यता","9953451608")}><h3>सोसाइटी से जुड़ें</h3><p>संपर्क: <a href="tel:9953451608">99534 51608</a></p><input required name="name" placeholder="आपका नाम"/><input required name="phone" type="tel" placeholder="मोबाइल नंबर"/><input name="help" type="hidden" value="सदस्यता के लिए"/><button className="button">WhatsApp पर सदस्य बनें</button></form><form onSubmit={e=>submit(e,"स्वयंसेवक","9599959886")}><h3>स्वयंसेवक बनें</h3><p>संपर्क: <a href="tel:9599959886">95999 59886</a></p><input required name="name" placeholder="आपका नाम"/><input required name="help" placeholder="आप किस काम में मदद करना चाहते हैं?"/><button>WhatsApp पर जुड़ें</button></form></div>{message && <p className="message">{message}</p>}</section>
    </main><footer id="contact"><a className="brand" href="#home"><b>बा</b><span>Buland Awaaz <small>Welfare Society</small></span></a><p>Gurugram, Haryana · <a href="tel:9953451608">99534 51608</a> · <a href="tel:9599959886">95999 59886</a></p><p>© 2026 Buland Awaaz Welfare Society</p></footer>
  </div>;
}
