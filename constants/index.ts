export const navLinks = [
    {
      label: "Home",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Transcriptions",
      route: "/transcriptions/add",
      icon: "/assets/icons/voice.png",
    },
    {
      label: "Profile",
      route: "/profile",
      icon: "/assets/icons/profile.svg",
    },
    {
      label: "Buy Credits",
      route: "/credits",
      icon: "/assets/icons/bag.svg",
    },
  ];
  
  export const plans = [
    {
      _id: 1,
      name: "Free",
      icon: "/assets/icons/free-plan.svg",
      price: 0,
      credits: 60,
      inclusions: [
        {
          label: "60 Free Credits",
          isIncluded: true,
        },
        {
          label: "Basic Access to Services",
          isIncluded: true,
        },
        {
          label: "Transcription to PDF",
          isIncluded: false,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Pro Package",
      icon: "/assets/icons/free-plan.svg",
      price: 15,
      credits: 1000,
      inclusions: [
        {
          label: "1000 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Transcription to PDF",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Premium Package",
      icon: "/assets/icons/free-plan.svg",
      price: 50,
      credits: 2500,
      inclusions: [
        {
          label: "2500 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Transcription to PDF",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: true,
        },
      ],
    },
  ];
  
  
  export const creditFee = -1;