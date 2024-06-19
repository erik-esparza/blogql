save file

{/_ Static Banner for Partners Section _/}
<div
className={`mb-8 p-4 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-700" : "bg-gray-100"
        }`} >
<h3 className="text-xl font-bold mb-4">Partners</h3>
<div className="flex flex-col items-center justify-center text-center">
<p className="mb-4 text-2xl">
Become a partner and join our platform to gain exclusive benefits!
</p>
<p className="mb-4 text-lg">
Join our Partner Program and earn a 20% lifetime commission on
referred clients. Enjoy exclusive benefits like personalized partner
management, access to exclusive content, and a spot in our Partner
Directory. Empower your clients with RevenueHunt's tools and watch
their businesses thrive.
</p>
<Link href="https://revenuehunt.com/partners" passHref>
<div className="p-2 bg-blue-500 text-white rounded-lg text-lg cursor-pointer">
Learn More
</div>
</Link>
</div>
</div>

              {/* Sign Up to Download PDF */}
        <div
          className={`flex-2 p-4 w-full md:w-1/4 self-start rounded-lg shadow-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">
            Join our newsletter, receive the latest tips & tricks
          </h3>
          <p className="text-black mb-4">
            Join 4,500+ customers receiving bi-monthly information about our
            app, how to use quizzes and the best tips & tricks for your
            ecommerce.
          </p>
          <form className="flex flex-col md:flex-row items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-lg border border-gray-300 mb-4 md:mb-0 md:mr-4 flex-1"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              Download
            </button>
          </form>
        </div>
