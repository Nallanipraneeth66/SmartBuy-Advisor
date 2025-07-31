// About.js
const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h1 className="text-3xl font-bold text-white">About SmartBuy Advisor</h1>
        </div>
        <div className="p-8">
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="text-lg mb-6">
              SmartBuy Advisor is an AI-powered recommendation platform that helps users make better purchasing decisions.
              Our goal is to bring intelligent, review-based product suggestions to shoppers of all kinds.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-3 text-xl">Our Mission</h3>
                <p>To simplify shopping decisions through unbiased, data-driven recommendations.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-3 text-xl">Technology</h3>
                <p>Using advanced AI to analyze thousands of products and reviews.</p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Us</h3>
              <p>Have questions? Reach out to our support team at support@smartbuyadvisor.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;