const url = process.argv[2] ?? "http://localhost:3000";

async function main() {
  const response = await fetch(url);
  const headers = [
    "content-security-policy",
    "content-security-policy-report-only",
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "x-dns-prefetch-control",
  ];

  console.log(`Security headers for ${url}\n`);

  for (const name of headers) {
    const value = response.headers.get(name);
    console.log(`${name}: ${value ?? "(not set)"}`);
  }

  const csp =
    response.headers.get("content-security-policy") ??
    response.headers.get("content-security-policy-report-only");

  if (!csp?.includes("nonce-")) {
    console.error("\nCSP nonce not found in policy");
    process.exit(1);
  }

  console.log("\nCSP nonce present.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
