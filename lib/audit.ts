import AuditLog from "@/models/auditlog";

type AuditAction = "create" | "update" | "delete";

interface AuditActor {
  _id?: unknown;
  username?: string;
  email?: string;
}

interface AuditChange {
  field: string;
  from: unknown;
  to: unknown;
}

// App fields tracked for change history. Keeping an explicit list avoids
// logging noise from Mongo internals such as __v.
export const TRACKED_APP_FIELDS = [
  "name",
  "image",
  "imagePublicId",
  "packageName",
  "publisher",
  "category",
  "size",
  "rating",
  "version",
  "platform",
  "price",
  "description",
  "downloadUrl",
  "requirements",
  "modInfo",
  "normalizedName",
  "tags",
  "screenshots",
  "screenshotsPublicIds",
] as const;

const normalize = (value: unknown) =>
  value === undefined || value === null ? null : value;

export function diffApp(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): AuditChange[] {
  const changes: AuditChange[] = [];

  for (const field of TRACKED_APP_FIELDS) {
    const from = normalize(before?.[field]);
    const to = normalize(after?.[field]);

    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes.push({ field, from, to });
    }
  }

  return changes;
}

/**
 * Persist an immutable audit entry. Logging is best-effort: a failure here
 * must never break the admin action that triggered it.
 */
export async function recordAppAudit({
  action,
  app,
  actor,
  changes = [],
}: {
  action: AuditAction;
  app: Record<string, unknown> | null | undefined;
  actor: AuditActor;
  changes?: AuditChange[];
}) {
  try {
    const actorId = actor?._id ? String(actor._id) : undefined;

    await AuditLog.create({
      action,
      entity: "app",
      entityId: app?._id ? String(app._id) : undefined,
      entityName: typeof app?.name === "string" ? app.name : undefined,
      actorId,
      actorUsername: actor?.username,
      actorEmail: actor?.email,
      changes,
      snapshot: app ?? undefined,
    });
  } catch (error) {
    console.error("Failed to record app audit log", error);
  }
}
