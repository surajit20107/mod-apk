import mongoose, { Schema, model } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    entity: {
      type: String,
      default: "app",
      index: true,
    },
    entityId: String,
    entityName: String,
    actorId: String,
    actorUsername: String,
    actorEmail: String,
    // Field level before/after values for updates
    changes: [
      {
        field: String,
        from: Schema.Types.Mixed,
        to: Schema.Types.Mixed,
      },
    ],
    // Full record at the time of the action, useful to inspect deleted apps
    snapshot: Schema.Types.Mixed,
  },
  { timestamps: true },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entityId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || model("AuditLog", auditLogSchema);
