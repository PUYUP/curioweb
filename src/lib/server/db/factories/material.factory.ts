import { db } from "../index.js";
import type { ChallengeFilter } from "@/lib/types/interfaces";
import { getTableColumns } from "drizzle-orm";
import { and, eq, desc, exists, inArray } from "drizzle-orm/sql";
import { learningMaterials } from "../schemas/material.schema.js";
import { workspaceMembers, workspaces } from "../schemas/workspace.schema.js";
import { attachments } from "../schemas/attachment.schema.js";

class MaterialFactory {

    /**
     * Get all materials by user id
     * @param userId User id
     * @returns Materials array
     */
    async getByUserId(userId: string, filter: ChallengeFilter = { limit: 10, offset: 0 }) {
        try {
            const results = await db
                .select({
                    ...getTableColumns(learningMaterials),
                    workspace: getTableColumns(workspaces),
                })
                .from(learningMaterials)
                .innerJoin(workspaces, eq(learningMaterials.workspaceId, workspaces.id))
                .where(
                    exists(
                        db
                            .select({ id: workspaceMembers.id })
                            .from(workspaceMembers)
                            .where(
                                and(
                                    eq(workspaceMembers.workspaceId, learningMaterials.workspaceId),
                                    eq(workspaceMembers.userId, userId)
                                )
                            )
                    )
                )
                .orderBy(desc(learningMaterials.createdAt))
                .limit(filter.limit)
                .offset(filter.offset);

            if (results.length === 0) {
                return results.map((r) => ({ ...r, attachments: [] }));
            }

            const materialIds = results.map((r) => r.id);

            const materialAttachments = await db.query.attachments.findMany({
                where: and(
                    eq(attachments.entityType, "learning_material"),
                    inArray(attachments.entityId, materialIds)
                ),
                with: {
                    file: true,
                },
            });

            const attachmentsByMaterialId = new Map<string, typeof materialAttachments>();
            for (const attachment of materialAttachments) {
                const list = attachmentsByMaterialId.get(attachment.entityId) ?? [];
                list.push(attachment);
                attachmentsByMaterialId.set(attachment.entityId, list);
            }

            return results.map((material) => ({
                ...material,
                attachments: attachmentsByMaterialId.get(material.id) ?? [],
            }));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get materials", { cause: error });
            } else {
                throw new Error("Failed to get materials");
            }
        }
    }

    async getByMaterialId(materialId: string) {
        try {
            const result = await db.query.learningMaterials.findFirst({
                where: eq(learningMaterials.id, materialId),
                with: {
                    workspace: true,
                },
            });

            if (!result) {
                return null;
            }

            const materialAttachments = await db.query.attachments.findMany({
                where: and(
                    eq(attachments.entityType, "learning_material"),
                    eq(attachments.entityId, materialId)
                ),
                with: {
                    file: true,
                },
            });

            return {
                ...result,
                attachments: materialAttachments,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to get material", { cause: error });
            } else {
                throw new Error("Failed to get material");
            }
        }
    }

}

export const materialFactory = new MaterialFactory();