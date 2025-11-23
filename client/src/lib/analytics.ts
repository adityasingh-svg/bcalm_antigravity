import { supabase } from './supabase';

function getUserId(): string {
  let uid = localStorage.getItem("uid");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("uid", uid);
  }
  return uid;
}

export async function trackEvent(eventName: string, data: Record<string, any> = {}) {
  try {
    const userId = getUserId();
    await supabase.from("events").insert([
      {
        user_id: userId,
        event_name: eventName,
        event_data: data
      }
    ]);
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

export function trackPageView() {
  const utmParams = Object.fromEntries(new URLSearchParams(window.location.search));
  trackEvent("page_view", {
    url: window.location.href,
    utm: utmParams
  });
}
