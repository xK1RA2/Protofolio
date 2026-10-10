// Source of truth for the site. Mirrors Mohamad_Al-Barghouthi_CV_Updated.pdf.
export const profile = {
  name: "Mohamad Majd Al-Barghouthi",
  title: "Software Engineer | Web Developer",
  location: "Amman, Jordan",
  phone: "+962 78 784 7915",
  email: "mohamad.majd.br@icloud.com",
  summary:
    "Software Engineer (B.Sc. Computer Information Systems, 2025) who builds client websites from scratch with Drupal 11 and full-stack applications with PHP and Laravel. Comfortable across the stack: REST APIs, relational databases, automated testing and CI, and a mobile client in React Native. Cares about secure, maintainable code.",
  socials: {
    github: "https://github.com/xK1RA2",
    linkedin: "",
  },
};

export const experience = [
  {
    role: "Software Engineer",
    company: "Sprintive",
    period: "2025 - Present",
    bullets: [
      "Build websites from scratch with Drupal 11: site architecture, theming and module configuration.",
      "Develop and maintain web applications and features as part of the web development team.",
      "Support backend development for client projects using PHP and Laravel.",
    ],
  },
];

export const projects = [
  {
    title: "Property Center",
    kind: "Real-estate marketplace",
    link: "https://github.com/xK1RA2/Property_Center",
    linkLabel: "View on GitHub",
    stack: ["Laravel 12", "MySQL", "React Native (Expo)", "TypeScript", "Docker", "GitHub Actions"],
    bullets: [
      "Built a full-stack marketplace where users browse, save, book and rate properties and dealers manage listings and approve visits: a Blade website, a versioned REST API with token authentication, and a cross-platform mobile app.",
      "Structured the backend around a shared service layer, policies and role middleware, so the website and the API apply the same business and authorization rules.",
      "Wrote 186 PHPUnit tests and a GitHub Actions pipeline that runs them on SQLite and MySQL 8.4; the pipeline surfaced real Linux-only and MySQL-only bugs that were then fixed.",
      "Ran a security review and fixed an OAuth account-takeover, a password-reset weakness and personal-data exposure; upgraded Laravel 11 to 12 to clear 48 dependency advisories.",
      "Added a Docker Compose deployment setup (app, MySQL, queue worker, HTTPS proxy) with backup and operations documentation; implemented push notifications, an email newsletter with double opt-in, and map-based listings.",
    ],
  },
];

export const skills = [
  {
    category: "Core",
    items: ["PHP", "Laravel", "Drupal 11", "MySQL", "REST APIs", "HTML", "CSS", "Bootstrap", "Tailwind CSS", "Git"],
  },
  {
    category: "Working knowledge",
    items: ["React Native (Expo)", "TypeScript", "PHPUnit", "Docker", "GitHub Actions (CI)"],
  },
];

export const education = {
  degree: "Bachelor's Degree, Computer Information Systems (CIS)",
  status: "Graduated 2025",
};

export const courses = [
  { name: "Full Stack Web Development", provider: "beProgrammer", hours: 108 },
  { name: "Laravel", provider: "TheCodeholic", hours: 40 },
  { name: "Laravel", provider: "Udemy", hours: 40 },
  { name: "PHP", provider: "Udemy", hours: 48 },
  { name: "Tailwind CSS", provider: "Udemy", hours: 12 },
];

export const languages = [
  { name: "Arabic", level: "Native", value: 100 },
  { name: "English", level: "B2 (Upper Intermediate)", value: 70 },
  { name: "German", level: "A2 (Elementary)", value: 30 },
];
