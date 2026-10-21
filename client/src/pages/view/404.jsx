
const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[550px]">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl font-medium">Page Not Found</p>
        <p className="text-gray-600 mb-6">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => window.location.href = "/"}>Go Back to Home</button>
    </div>
  )
}

export default Error404