import { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext({ lang: "en", toggle: () => {} });

export const STR = {
  en: {
    nav: { manifesto: "Manifesto", programs: "Programs", news: "News", join: "Join", wall: "Awaaz Wall", volunteer: "Volunteer" },
    hero: {
      tag: "Gurugram · Haryana · A people's movement",
      para: "The strong voice for those who go unheard — fighting child labour, child marriage and silence around women's dignity, street by street, home by home.",
      cta1: "Raise your hand",
      cta2: "Our work",
      cue: "Scroll — the manifesto awaits",
      badge: "Every voice counts",
    },
    marquee: ["Child rights", "Education for all", "End child labour", "Stop child marriage", "Women's dignity", "Community first"],
    impact: {
      label: "Impact so far (sample)",
      items: [
        { num: 1200, suffix: "+", label: "Children enrolled in school" },
        { num: 85, suffix: "+", label: "Campaigns & drives" },
        { num: 300, suffix: "+", label: "Active volunteers" },
        { num: 40, suffix: "+", label: "Communities reached" },
      ],
    },
    manifesto: {
      label: "The manifesto — what we fight for",
      h2a: "We are not asking",
      h2b: "We are insisting",
      caption: "The voice that refuses to be silenced",
      chapters: [
        { num: "01", title: "Every child in school", text: "We go door to door, find the children the system forgot, counsel their families and walk them into a classroom. Enrollment is not a favour — it is a right." },
        { num: "02", title: "No child at work", text: "Small hands are meant for books, not bricks. We identify child labour in our communities, intervene with families and employers, and stay until the child is safe." },
        { num: "03", title: "No child bride", text: "A girl is not a burden to be married off. We campaign against child marriage, dowry and the quiet customs that steal childhoods — loudly, publicly, relentlessly." },
        { num: "04", title: "Every woman heard", text: "From village squares to city streets, we stand with women facing violence and discrimination — because dignity is not negotiable and silence is not an option." },
      ],
    },
    programs: {
      label: "On the ground",
      h2a: "What we do,",
      h2b: "where it counts",
      cards: [
        { id: "child-rights", num: "P.01", tag: "Protection", title: "Child rights & protection", text: "Surveys, rescue referrals and family counselling to pull children out of labour and abuse — and keep them out." },
        { id: "education", num: "P.02", tag: "Education", title: "Education & enrollment", text: "Admission support, documentation help and follow-ups so no child drops through the cracks between home and school." },
        { id: "women", num: "P.03", tag: "Dignity", title: "Women's empowerment", text: "Campaigns against dowry and violence, and circles where women learn their rights — and use them." },
        { id: "community", num: "P.04", tag: "Outreach", title: "Community campaigns", text: "Street plays, marches and city drives — from child marriage awareness to Good Morning Gurugram's cleanliness mission." },
      ],
    },
    news: { label: "From the field", h2: "News & events", loading: "Loading updates…", empty: "No updates yet — check back soon.", types: { news: "news", event: "event" } },
    join: {
      label: "Membership · Sadasyata",
      h2a: "Join Buland",
      h2b: "Awaaz",
      para: "Apni awaaz, apna manch. Member baniye aur har uss ladai ka hissa baniye jo bachchon aur mahilaon ke haq ke liye ladi jaati hai.",
      perks: [
        "Ground campaigns — marches, street plays, awareness drives across Gurugram and beyond.",
        "Field work — door-to-door surveys, school enrollment support, family counselling.",
        "Community circles — stand with women and children who need a voice beside them.",
      ],
      formTitle: "Membership form",
      formSub: "2 minute · koi fees nahi",
      fields: { name: "Naam / Full name", phone: "Phone", city: "Sheher / City", email: "Email", help: "Kaise help karna chahenge?", reason: "Kyu join karna chahte hain? (optional)" },
      ph: { name: "Aapka naam", phone: "+91 …", city: "Gurugram…", email: "you@example.com", reason: "Apni baat kuch shabdon me…" },
      options: [
        { v: "Campaigns & Marches", l: "Campaigns & Marches" },
        { v: "Teaching & Tuition Support", l: "Teaching & Tuition Support" },
        { v: "Door-to-Door Surveys", l: "Door-to-Door Surveys" },
        { v: "Social Media & Content", l: "Social Media & Content" },
        { v: "Event Days", l: "Event Days" },
        { v: "Jo bhi zaroorat ho", l: "Jo bhi zaroorat ho" },
      ],
      submit: "Member baniye",
      sending: "Join ho raha hai…",
      toast: "Shukriya! Ab aap Buland Awaaz parivaar ka hissa hain. Team jald sampark karegi.",
    },
    involved: {
      label: "Get involved",
      h2a: "Raise your hand",
      h2b: "Raise your voice",
      volTitle: "Volunteer with us",
      volPara: "Surveys, campaigns, teaching support, event days — there is a role for every pair of hands.",
      contactTitle: "Talk to the team",
      contactPara: "Report a child in distress, invite us to your community, or partner on a campaign.",
      fields: { name: "Full name", email: "Email", phone: "Phone", interest: "I want to help with", msg: "Anything we should know? (optional)", contactName: "Name", contactPhone: "Phone (optional)", contactMsg: "Message" },
      ph: { name: "Your name", email: "you@example.com", phone: "+91 …", volMsg: "Skills, availability, city…", contactMsg: "Tell us what's on your mind…" },
      interests: [
        { v: "Child Rights", l: "Child Rights" },
        { v: "Education", l: "Education" },
        { v: "Women's Empowerment", l: "Women's Empowerment" },
        { v: "Community Campaigns", l: "Community Campaigns" },
        { v: "General", l: "General" },
      ],
      volBtn: "Join as a volunteer",
      volSending: "Joining…",
      contactBtn: "Send message",
      contactSending: "Sending…",
      volToast: "Welcome to the movement. Our team will reach out to you.",
      contactToast: "Message received. We will get back to you soon.",
    },
    footer: {
      reach: "Reach us",
      addr1: "Gurugram, Haryana, India",
      addr2: "Working across Haryana, Rajasthan & Punjab",
      navTitle: "Navigate",
      joinTitle: "Join us",
      member: "Member baniye",
      copyright: "Buland Awaaz · Made loud in Gurugram · Demo site — sab content sample hai",
    },
    chat: {
      title: "Ask Buland",
      headerSub: "AI assistant · Hindi ya English — dono chalega",
      greeting: "Namaste! Main Buland Mitra hoon — Buland Awaaz ki AI awaaz. Hamare kaam, campaigns ya volunteering ke baare me kuch bhi poochhiye. Hindi ya English, jaise aapko aasan lage!",
      placeholder: "Kuch bhi poochhiye…",
      error: "Abhi connect karne me dikkat ho rahi hai. Thodi der baad try kariye, ya neeche contact form bhar dijiye.",
      suggestions: ["Buland Awaaz kya karti hai?", "Main volunteer kaise banu?", "Aap kahan kaam karte hain?"],
    },
    supporters: {
      label: "Supporters · Hamare log",
      h1a: "The Awaaz",
      h1b: "Wall",
      loading: "Loading…",
      sub: "{n} log awaaz ban chuke hain — aur har roz koi na koi judta ja raha hai.",
      empty: "Abhi koi member nahi — pehle baniye!",
      ctaTitle: "Aapka naam bhi yahan hona chahiye",
      ctaBtn: "Member baniye",
      back: "Back to site",
      joined: "Joined",
    },
  },
  hi: {
    nav: { manifesto: "घोषणा", programs: "कार्यक्रम", news: "समाचार", join: "जुड़ें", wall: "अवाज़ वॉल", volunteer: "स्वयंसेवक" },
    hero: {
      tag: "गुरुग्राम · हरियाणा · एक जन-आंदोलन",
      para: "जिनकी आवाज़ दबी है — उनकी बुलंद आवाज़। बाल श्रम, बाल विवाह और महिला गरिमा पर खामोशी के खिलाफ लड़ाई, गली-गली, घर-घर।",
      cta1: "हाथ उठाइए",
      cta2: "हमारा काम",
      cue: "स्क्रॉल कीजिए — घोषणा इंतज़ार में है",
      badge: "हर आवाज़ मायने रखती है",
    },
    marquee: ["बाल अधिकार", "सबके लिए शिक्षा", "बाल श्रम बंद करो", "बाल विवाह रोको", "महिला गरिमा", "समुदाय पहले"],
    impact: {
      label: "असर — अब तक (सैंपल)",
      items: [
        { num: 1200, suffix: "+", label: "बच्चे स्कूल पहुंचे" },
        { num: 85, suffix: "+", label: "अभियान व ड्राइव" },
        { num: 300, suffix: "+", label: "सक्रिय स्वयंसेवक" },
        { num: 40, suffix: "+", label: "समुदायों तक पहुंच" },
      ],
    },
    manifesto: {
      label: "घोषणापत्र — हम किसके लिए लड़ते हैं",
      h2a: "हम विनती नहीं कर रहे",
      h2b: "हम हक मांग रहे हैं",
      caption: "वह आवाज़ जो दबने से इनकार करती है",
      chapters: [
        { num: "01", title: "हर बच्चा स्कूल में", text: "हम घर-घर जाते हैं, उन बच्चों को ढूंढते हैं जिन्हें व्यवस्था भूल गई, उनके परिवारों को समझाते हैं और उन्हें कक्षा तक पहुंचाते हैं। दाखिला कोई एहसान नहीं — यह अधिकार है।" },
        { num: "02", title: "कोई बच्चा काम पर नहीं", text: "नन्हे हाथ किताबों के लिए हैं, ईंटों के लिए नहीं। हम बाल श्रम पहचानते हैं, परिवारों और नियोक्ताओं से हस्तक्षेप करते हैं, और तब तक नहीं रुकते जब तक बच्चा सुरक्षित न हो।" },
        { num: "03", title: "कोई बाल वधू नहीं", text: "कोई लड़की बोझ नहीं जिसे ब्याह दिया जाए। हम बाल विवाह, दहेज और उन खामोश रिवाजों के खिलाफ अभियान चलाते हैं जो बचपन चुराते हैं — जोर से, खुलकर, लगातार।" },
        { num: "04", title: "हर महिला की सुनी जाए", text: "गांव के चौक से शहर की सड़कों तक, हम हिंसा और भेदभाव झेल रही महिलाओं के साथ खड़े हैं — क्योंकि गरिमा मोलभाव नहीं है और खामोशी कोई विकल्प नहीं।" },
      ],
    },
    programs: {
      label: "जमीन पर",
      h2a: "हम क्या करते हैं,",
      h2b: "जहां ज़रूरत है",
      cards: [
        { id: "child-rights", num: "P.01", tag: "सुरक्षा", title: "बाल अधिकार व सुरक्षा", text: "बच्चों को श्रम और शोषण से बाहर निकालने के लिए सर्वे, रेफरल और पारिवारिक परामर्श — और उन्हें सुरक्षित रखने तक।" },
        { id: "education", num: "P.02", tag: "शिक्षा", title: "शिक्षा व दाखिला", text: "दाखिला सहायता, दस्तावेज़ मदद और फॉलो-अप, ताकि घर और स्कूल के बीच कोई बच्चा न छूटे।" },
        { id: "women", num: "P.03", tag: "गरिमा", title: "महिला सशक्तिकरण", text: "दहेज और हिंसा के खिलाफ अभियान, और ऐसे समूह जहां महिलाएं अपने अधिकार जानती हैं — और इस्तेमाल करती हैं।" },
        { id: "community", num: "P.04", tag: "आउटरीच", title: "सामुदायिक अभियान", text: "नुक्कड़ नाटक, मार्च और शहरी अभियान — बाल विवाह जागरूकता से लेकर गुड मॉर्निंग गुरुग्राम की सफाई मुहिम तक।" },
      ],
    },
    news: { label: "मैदान से", h2: "समाचार व कार्यक्रम", loading: "अपडेट लोड हो रहे हैं…", empty: "अभी कोई अपडेट नहीं — जल्द मिलिए।", types: { news: "समाचार", event: "कार्यक्रम" } },
    join: {
      label: "सदस्यता · Membership",
      h2a: "बुलंद आवाज़",
      h2b: "से जुड़ें",
      para: "अपनी आवाज़, अपना मंच। सदस्य बनिए और हर उस लड़ाई का हिस्सा बनिए जो बच्चों और महिलाओं के हक के लिए लड़ी जाती है।",
      perks: [
        "ग्राउंड कैंपेन — गुरुग्राम और आसपास मार्च, नुक्कड़ नाटक, जागरूकता अभियान।",
        "फील्ड वर्क — घर-घर सर्वे, स्कूल दाखिला सहायता, पारिवारिक परामर्श।",
        "कम्युनिटी सर्कल — उन महिलाओं और बच्चों के साथ खड़े रहिए जिन्हें साथ की ज़रूरत है।",
      ],
      formTitle: "सदस्यता फॉर्म",
      formSub: "2 मिनट · कोई फीस नहीं",
      fields: { name: "पूरा नाम", phone: "फोन", city: "शहर", email: "ईमेल", help: "कैसे मदद करना चाहेंगे?", reason: "क्यों जुड़ना चाहते हैं? (वैकल्पिक)" },
      ph: { name: "आपका नाम", phone: "+91 …", city: "गुरुग्राम…", email: "you@example.com", reason: "अपनी बात कुछ शब्दों में…" },
      options: [
        { v: "Campaigns & Marches", l: "अभियान व मार्च" },
        { v: "Teaching & Tuition Support", l: "पढ़ाई व ट्यूशन सहायता" },
        { v: "Door-to-Door Surveys", l: "घर-घर सर्वे" },
        { v: "Social Media & Content", l: "सोशल मीडिया व कंटेंट" },
        { v: "Event Days", l: "इवेंट डेज़" },
        { v: "Jo bhi zaroorat ho", l: "जो भी ज़रूरत हो" },
      ],
      submit: "सदस्य बनिए",
      sending: "जुड़ रहे हैं…",
      toast: "शुक्रिया! अब आप बुलंद आवाज़ परिवार के हिस्से हैं। टीम जल्द संपर्क करेगी।",
    },
    involved: {
      label: "जुड़िए",
      h2a: "हाथ उठाइए",
      h2b: "आवाज़ उठाइए",
      volTitle: "हमारे साथ स्वयंसेवक बनें",
      volPara: "सर्वे, कैंपेन, पढ़ाई सहायता, इवेंट डेज़ — हर जोड़ी हाथों के लिए एक भूमिका है।",
      contactTitle: "टीम से बात कीजिए",
      contactPara: "किसी संकट में बच्चे की सूचना दें, हमें अपने समुदाय में बुलाएं, या अभियान में साझेदारी करें।",
      fields: { name: "पूरा नाम", email: "ईमेल", phone: "फोन", interest: "मैं मदद करना चाहूंगा/चाहूंगी", msg: "कुछ और बताना चाहेंगे? (वैकल्पिक)", contactName: "नाम", contactPhone: "फोन (वैकल्पिक)", contactMsg: "संदेश" },
      ph: { name: "आपका नाम", email: "you@example.com", phone: "+91 …", volMsg: "हुनर, समय, शहर…", contactMsg: "बताइए क्या कहना है…" },
      interests: [
        { v: "Child Rights", l: "बाल अधिकार" },
        { v: "Education", l: "शिक्षा" },
        { v: "Women's Empowerment", l: "महिला सशक्तिकरण" },
        { v: "Community Campaigns", l: "सामुदायिक अभियान" },
        { v: "General", l: "सामान्य" },
      ],
      volBtn: "स्वयंसेवक बनें",
      volSending: "जुड़ रहे हैं…",
      contactBtn: "संदेश भेजें",
      contactSending: "भेजा जा रहा है…",
      volToast: "आंदोलन में स्वागत है। हमारी टीम आपसे संपर्क करेगी।",
      contactToast: "संदेश मिल गया। हम जल्द जवाब देंगे।",
    },
    footer: {
      reach: "संपर्क",
      addr1: "गुरुग्राम, हरियाणा, भारत",
      addr2: "हरियाणा, राजस्थान व पंजाब में सक्रिय",
      navTitle: "नेविगेट",
      joinTitle: "जुड़ें",
      member: "सदस्य बनिए",
      copyright: "Buland Awaaz · गुरुग्राम में बुलंद · डेमो साइट — सभी कंटेंट सैंपल है",
    },
    chat: {
      title: "बुलंद से पूछिए",
      headerSub: "AI सहायक · NGO के बारे में जवाब",
      greeting: "नमस्ते! मैं बुलंद मित्र हूं — बुलंद आवाज़ की AI आवाज़। हमारे काम, अभियानों या स्वयंसेवा के बारे में पूछिए।",
      placeholder: "हमारे काम के बारे में पूछिए…",
      error: "अभी कनेक्ट करने में दिक्कत हो रही है। कृपया थोड़ी देर बाद कोशिश करें, या नीचे संपर्क फॉर्म भरें।",
      suggestions: ["बुलंद आवाज़ क्या करती है?", "मैं स्वयंसेवक कैसे बनूं?", "आप कहां काम करते हैं?"],
    },
    supporters: {
      label: "समर्थक · हमारे लोग",
      h1a: "द अवाज़",
      h1b: "वॉल",
      loading: "लोड हो रहा है…",
      sub: "{n} लोग अवाज़ बन चुके हैं — और हर रोज़ कोई न कोई जुड़ता जा रहा है।",
      empty: "अभी कोई सदस्य नहीं — पहले बनिए!",
      ctaTitle: "आपका नाम भी यहां होना चाहिए",
      ctaBtn: "सदस्य बनिए",
      back: "साइट पर वापस",
      joined: "जुड़े",
    },
  },
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("ba-lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("hi", lang === "hi");
    try {
      localStorage.setItem("ba-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggle = () => setLang((p) => (p === "en" ? "hi" : "en"));

  return <LangContext.Provider value={{ lang, toggle, setLang }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
