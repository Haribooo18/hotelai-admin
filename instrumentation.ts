let startupRegistered = false;

export async function register() {
  if (startupRegistered) {
    return;
  }

  startupRegistered = true;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runStartupValidation } = await import("@/lib/ops/startup");
    runStartupValidation();
  }
}
