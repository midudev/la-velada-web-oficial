import { createHash } from "node:crypto"

import type { User } from "@auth/core/types"

export const generateUserId = (user: User) => {
	if (!user.email) throw new Error("User email is required")
	return createHash("sha256").update(user.email).digest("hex")
}
