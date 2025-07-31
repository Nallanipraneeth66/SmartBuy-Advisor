// TermsOfService.js
const TermsOfService = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>
        <div className="p-8">
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="text-lg mb-6">
              By using SmartBuy Advisor, you agree to comply with our terms of use. Please read them carefully before using our platform.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Acceptable Use</h3>
              <p>The service is intended for personal, non-commercial use only.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Intellectual Property</h3>
              <p>All content and recommendations are proprietary to SmartBuy Advisor.</p>
            </div>

            <p className="text-gray-600 italic">
              Use of this service is subject to applicable laws and ethical usage policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TermsOfService;