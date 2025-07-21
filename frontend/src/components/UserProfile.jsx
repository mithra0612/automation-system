function UserProfile({ user }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-950/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800/70 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">User Profile</h3>
      
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-20 h-20 rounded-full border-2 border-blue-500/30 shadow-lg"
          />
        </div>

        {/* User Details */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Username</label>
              <p className="text-gray-100 font-medium">@{user.login}</p>
            </div>
            
            {user.name && (
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-gray-100 font-medium">{user.name}</p>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-500">Account Type</label>
              <p className="text-gray-100 font-medium capitalize">{user.type}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="text-gray-100 font-medium">{formatDate(user.created_at)}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Public Repositories</label>
              <p className="text-gray-100 font-medium">{user.public_repos}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Followers</label>
              <p className="text-gray-100 font-medium">{user.followers}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Following</label>
              <p className="text-gray-100 font-medium">{user.following}</p>
            </div>

            {user.company && (
              <div>
                <label className="text-sm text-gray-500">Company</label>
                <p className="text-gray-100 font-medium">{user.company}</p>
              </div>
            )}

            {user.location && (
              <div>
                <label className="text-sm text-gray-500">Location</label>
                <p className="text-gray-100 font-medium">{user.location}</p>
              </div>
            )}

            {user.email && (
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-100 font-medium">{user.email}</p>
              </div>
            )}
          </div>

          {user.bio && (
            <div>
              <label className="text-sm text-gray-500">Bio</label>
              <p className="text-gray-400">{user.bio}</p>
            </div>
          )}

          {user.blog && (
            <div>
              <label className="text-sm text-gray-500">Website</label>
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {user.blog}
              </a>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-500">GitHub Profile</label>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
