export const isValidURL = (string?: string) => {
  if (!string) return false;
  const res = string.match(
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
  );
  return res !== null;
};

export const isValidImageDomain = (string: string): boolean => {

  const domains = [

    "demo-source.imgix.net",

    "uywhaywnylcjrvkcsdem.supabase.co"

  ];

  return domains.some(domain => string.includes(domain));

};

export const cn = (...strings: (string | undefined)[]): string => {
  return strings.filter(Boolean).join(" ");
};

