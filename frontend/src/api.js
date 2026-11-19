const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error("Request failed"), { fields: body });
  return body;
}

export const api = {
  profile: () => request("/profile/"),
  services: () => request("/services/"),
  locations: () => request("/locations/"),
  stats: () => request("/stats/"),
  faqs: () => request("/faqs/"),
  testimonials: () => request("/testimonials/"),
  slots: (location, date) => request(`/availability/?location=${location}&date=${date}`),
  book: (data) => request("/appointments/", { method: "POST", body: JSON.stringify(data) }),
  contact: (data) => request("/contact/", { method: "POST", body: JSON.stringify(data) }),
  review: (data) => request("/testimonials/", { method: "POST", body: JSON.stringify(data) }),
};

/** Turn DRF's {field: ["msg"]} into one readable line. */
export const errorText = (e) =>
  e?.fields && typeof e.fields === "object"
    ? Object.values(e.fields).flat().join(" ")
    : "Could not reach the server. Please call 01921-196202.";
