const KLAVIYO_API_URL = "https://a.klaviyo.com/api";

function headers() {
  return {
    Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
    "Content-Type": "application/json",
    revision: "2024-10-15",
  };
}

export async function upsertProfile(
  email: string,
  quizResultType: string
): Promise<string> {
  const res = await fetch(`${KLAVIYO_API_URL}/profiles/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          email,
          properties: {
            quiz_result_type: quizResultType,
            quiz_completed_at: new Date().toISOString(),
          },
        },
      },
    }),
  });

  if (res.status === 409) {
    const existing = await res.json();
    const profileId =
      existing.errors?.[0]?.meta?.duplicate_profile_id;

    if (profileId) {
      await fetch(`${KLAVIYO_API_URL}/profiles/${profileId}/`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({
          data: {
            type: "profile",
            id: profileId,
            attributes: {
              properties: {
                quiz_result_type: quizResultType,
                quiz_completed_at: new Date().toISOString(),
              },
            },
          },
        }),
      });
      return profileId;
    }
  }

  if (!res.ok) {
    throw new Error(`Klaviyo profile creation failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data.id;
}

export async function addToList(
  profileId: string,
  listId: string
): Promise<void> {
  const res = await fetch(
    `${KLAVIYO_API_URL}/lists/${listId}/relationships/profiles/`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        data: [{ type: "profile", id: profileId }],
      }),
    }
  );

  if (!res.ok && res.status !== 204) {
    throw new Error(`Klaviyo add to list failed: ${res.status}`);
  }
}

export async function trackEvent(
  email: string,
  quizResultType: string
): Promise<void> {
  const res = await fetch(`${KLAVIYO_API_URL}/events/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: {
            data: {
              type: "metric",
              attributes: { name: "Quiz Completed" },
            },
          },
          profile: {
            data: {
              type: "profile",
              attributes: { email },
            },
          },
          properties: {
            result_type: quizResultType,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Klaviyo event tracking failed: ${res.status}`);
  }
}
