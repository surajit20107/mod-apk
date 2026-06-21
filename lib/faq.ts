export type FaqCategory = {
  id: string;
  label: string;
  description: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
};

export const categories: FaqCategory[] = [
  {
    id: "all",
    label: "All",
    description: "Browse every question",
  },
  {
    id: "general",
    label: "General",
    description: "General information about GETMODSAPK",
  },
  {
    id: "installation",
    label: "Installation",
    description: "APK, MOD APK, and OBB installation guides",
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    description: "Fix download, installation, and app issues",
  },
  {
    id: "files",
    label: "OBB Files",
    description: "Learn about OBB and additional game data files",
  },
  {
    id: "mods",
    label: "MOD APKs",
    description: "Questions about modified and premium apps",
  },
];

export const faqs: FaqItem[] = [
  {
    id: "what-is-getmodsapk",
    category: "general",
    popular: true,
    question: "What is GETMODSAPK?",
    answer:
      "GETMODSAPK.COM is one of the most successful and authentic websites to download the modified version of applications and games. The mods available on GETMODSAPK.COM are authentic and 100% working, so you don't need to look elsewhere for modified variants.",
  },
  {
    id: "how-to-install-obb",
    category: "installation",
    popular: true,
    question: "How to Install OBB?",
    answer:
      "OBB files mostly belong to Android Studio by Google. OBB files are expansion files used by Android applications to store additional data that would exceed the size limit of the main APK file.",
  },
  {
    id: "what-is-apk-installer",
    category: "installation",
    question: "What is an APK Installer?",
    answer:
      "Another way of game installation. APK Installer comes with an attached OBB file and provides a simple and fast way of installing OBB games.",
  },
  {
    id: "download-not-working",
    category: "troubleshooting",
    popular: true,
    question: "Download is not Working?",
    answer:
      "As we provide fast cloud storage links for downloading files, sometimes due to an error, a file may become unavailable. Please comment on the article and we will fix it soon.",
  },
  {
    id: "what-are-obb-files",
    category: "files",
    question: "What are the OBB Files?",
    answer:
      "Some advanced games and apps come with high-end graphics, sound, and additional resources. OBB files contain this extra data. Apps downloaded from the Play Store usually handle OBB files automatically.",
  },
  {
    id: "apk-not-installing",
    category: "troubleshooting",
    question: "APK not Installing on your device?",
    answer:
      "This is a common error that occurs when the same game or app is already installed on your device from another source.",
  },
  {
    id: "apk-not-working-properly",
    category: "troubleshooting",
    question: "Why is APK not working properly?",
    answer:
      "The original app or game may have been updated, making the mod version outdated. Download the latest mod version to ensure proper functionality.",
  },
  {
    id: "how-to-install-mod-apk",
    category: "installation",
    question: "How to Install MODS APK?",
    answer:
      "Search for the app on GETMODSAPK, scroll to the download section, download the APK, enable installation from unknown sources in your device settings, install the APK, and enjoy the app or game.",
  },
  {
    id: "paid-apps-free-in-mod",
    category: "mods",
    question: "Can I get paid Apps for free in Mod?",
    answer:
      "Yes, some modded versions provide premium features without requiring payment, depending on the specific application and mod.",
  },
];
