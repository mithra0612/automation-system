function RepositoryList({ repos }) {
  if (repos.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Repositories ({repos.length})
      </h3>
      <div className="space-y-3">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="flex items-center justify-between p-4 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <div>
                <h4 className="font-medium text-white">{repo.name}</h4>
                <p className="text-sm text-gray-400">{repo.full_name}</p>
                {repo.description && (
                  <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {repo.private ? 'Private' : 'Public'}
              </span>
              <div className={`w-2 h-2 rounded-full ${repo.private ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepositoryList;
