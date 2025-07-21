import React from 'react';

const Dashboard = ({ userProfile, githubStats }) => {
  return (
    <div className="flex flex-col items-center space-y-10 p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* User Profile Card */}
      <div className="w-full max-w-md bg-gradient-to-tr from-blue-200 via-white to-purple-200 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-blue-100 hover:scale-105 transition-transform duration-300">
        <div className="relative mb-4">
          <img
            src={userProfile.avatar_url}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg"
          />
          <span className="absolute bottom-0 right-0 bg-green-400 border-2 border-white rounded-full w-5 h-5"></span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 drop-shadow">{userProfile.name}</h2>
        <p className="text-blue-600 font-mono text-lg">@{userProfile.login}</p>
        <p className="mt-3 text-gray-700 text-center italic">{userProfile.bio}</p>
        <div className="mt-5 flex space-x-8">
          <span className="flex flex-col items-center text-gray-700">
            <span className="text-lg font-bold">{userProfile.followers}</span>
            <span className="text-xs">Followers</span>
          </span>
          <span className="flex flex-col items-center text-gray-700">
            <span className="text-lg font-bold">{userProfile.following}</span>
            <span className="text-xs">Following</span>
          </span>
        </div>
      </div>

      {/* GitHub Stats Card */}
      <div className="w-full max-w-md bg-gradient-to-tr from-purple-100 via-white to-blue-100 rounded-2xl shadow-xl p-8 border border-purple-100 hover:scale-105 transition-transform duration-300">
        <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center drop-shadow">GitHub Stats</h3>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Public Repos:</span>
            <span className="font-bold text-blue-700">{githubStats.public_repos}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Public Gists:</span>
            <span className="font-bold text-blue-700">{githubStats.public_gists}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Stars:</span>
            <span className="font-bold text-yellow-500">{githubStats.total_stars}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Forks:</span>
            <span className="font-bold text-green-600">{githubStats.total_forks}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;