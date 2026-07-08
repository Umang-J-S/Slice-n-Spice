import User from '@/models/userModel';

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase());

const allowedRoles = (process.env.ALLOWED_ROLES || 'admin,user')
  .split(',')
  .map((role) => role.trim().toLowerCase());

export class AuthService {
  /**
   * Finds an existing user by googleId, or links by email, or creates a new user.
   */
  static async findOrCreateGoogleUser(profile: {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
  }) {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const displayName = profile.displayName;

    let user = await User.findOne({ googleId });

    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        // Link existing email account to Google ID
        user.googleId = googleId;
        await user.save();
      }
    }

    if (!user) {
      const isBootstrappedAdmin = email ? adminEmails.includes(email) : false;
      const assignedRole = isBootstrappedAdmin ? 'admin' : 'user';

      user = await User.create({
        name: displayName,
        email: email || '',
        googleId,
        role: assignedRole,
      });
    }

    return user;
  }

  /**
   * Validates if a user's role is authorized to log in.
   */
  static validateUserRole(role: string): boolean {
    const userRole = role?.toLowerCase() || 'user';
    return allowedRoles.includes(userRole);
  }
}
