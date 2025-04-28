import Button from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    
    <div className="flex flex-col items-center justify-center min-h-215 bg-white px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Buy and Sell Anything on Dubizzle!
        </h1>

        {user ? (
          <>
            <p className="text-gray-600 text-lg">
              Welcome, {user.name} 👋
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button href="/profile">Go to Profile</Button>
              <Button href="/ads/new" variant="secondary">
                Post an Ad
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-lg">
              Login now to post your own ads and manage your deals.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button href="/login">Login</Button>
              <Button href="/register" variant="secondary">
                Register
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
