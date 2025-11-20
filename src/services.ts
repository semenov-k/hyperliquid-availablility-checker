export type CheckResult = {
  ok: boolean;
  title: string;
  message: string;
};

export const checkHyperunitAvailability = async (): Promise<CheckResult> => {
  try {
    const res = await fetch("https://api.hyperunit.xyz/v2/estimate-fees");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return {
      title: "Hyperunit",
      ok: true,
      message: JSON.stringify(data.solana, null, 2),
    };
  } catch (e) {
    return {
      title: "Hyperunit",
      ok: false,
      message: (e as Error).message.toString(),
    };
  }
};

export const checkHyperliquidAvailability = async (
  wallet: string,
): Promise<CheckResult> => {
  try {
    const res = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "legalCheck",
        user: wallet,
      }),
    });

    const data = await res.json();

    return {
      title: "Hyperliquid",
      ok: !!data.ipAllowed && !!data.userAllowed,
      message: JSON.stringify(data, null, 2),
    };
  } catch (e) {
    return {
      title: "Hyperliquid",
      ok: false,
      message: (e as Error).message.toString(),
    };
  }
};
