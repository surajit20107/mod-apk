"use client";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { Upload, Image, Camera, Package, Info, Link, Tag, Star, Send } from "lucide-react";

interface FormData {
  name: string;
  image: string;
  imagePublicId: string;
  packageName: string;
  publisher: string;
  category: string;
  size: string;
  rating: string;
  version: string;
  platform: string;
  price: string;
  description: string;
  downloadUrl: string;
  requirements: string;
  modInfo: string;
  screenshots: string[];
  screenshotsPublicIds: string[];
  tags: string[];
}

export default function CreateApp() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: "",
    imagePublicId: "",
    packageName: "",
    publisher: "",
    category: "",
    size: "",
    rating: "",
    version: "",
    platform: "",
    price: "",
    description: "",
    downloadUrl: "",
    requirements: "",
    modInfo: "",
    screenshots: [],
    screenshotsPublicIds: [],
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Create New App</h1>
          <p className="text-gray-400">Fill in the details below to add a new application</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={labelClasses}>
                  App Name
                </label>
                <input
                  required
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter app name"
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="packageName" className={labelClasses}>
                  Package Name
                </label>
                <input
                  required
                  id="packageName"
                  type="text"
                  name="packageName"
                  placeholder="com.example.app"
                  className={inputClasses}
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="publisher" className={labelClasses}>
                  Publisher URL
                </label>
                <input
                  required
                  id="publisher"
                  type="text"
                  name="publisher"
                  placeholder="https://publisher.com"
                  className={inputClasses}
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClasses}>
                  Category
                </label>
                <input
                  required
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Games, Tools, etc."
                  className={inputClasses}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="platform" className={labelClasses}>
                  Platform
                </label>
                <input
                  required
                  id="platform"
                  type="text"
                  name="platform"
                  placeholder="Android, iOS, etc."
                  className={inputClasses}
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Version & Pricing</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="version" className={labelClasses}>
                  Version
                </label>
                <input
                  required
                  id="version"
                  type="text"
                  name="version"
                  placeholder="1.0.0"
                  className={inputClasses}
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="size" className={labelClasses}>
                  Size
                </label>
                <input
                  required
                  id="size"
                  type="text"
                  name="size"
                  placeholder="50 MB"
                  className={inputClasses}
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="price" className={labelClasses}>
                  Price
                </label>
                <input
                  required
                  id="price"
                  type="text"
                  name="price"
                  placeholder="Free or $9.99"
                  className={inputClasses}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="rating" className={labelClasses}>
                  Rating (0-5)
                </label>
                <input
                  required
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  name="rating"
                  placeholder="4.5"
                  className={inputClasses}
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Link className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Details & Links</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description
                </label>
                <textarea
                  required
                  id="description"
                  name="description"
                  placeholder="Describe your app in detail..."
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="downloadurl" className={labelClasses}>
                    Download URL
                  </label>
                  <input
                    required
                    id="downloadurl"
                    type="text"
                    name="downloadUrl"
                    placeholder="https://download.link/app.apk"
                    className={inputClasses}
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className={labelClasses}>
                    Requirements
                  </label>
                  <input
                    required
                    id="requirements"
                    type="text"
                    name="requirements"
                    placeholder="Android 5.0+"
                    className={inputClasses}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="modinfo" className={labelClasses}>
                    Mod Info
                  </label>
                  <input
                    required
                    id="modinfo"
                    type="text"
                    name="modInfo"
                    placeholder="Premium Unlocked, No Ads"
                    className={inputClasses}
                    value={formData.modInfo}
                    onChange={(e) => setFormData({ ...formData, modInfo: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="tags" className={labelClasses}>
                    Tags (comma separated)
                  </label>
                  <input
                    required
                    id="tags"
                    type="text"
                    name="tags"
                    placeholder="mod, premium, unlocked"
                    className={inputClasses}
                    value={formData.tags.join(",")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((tag) => tag.trim()),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Camera className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Media</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className={labelClasses}>App Icon</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-pink-500/50 transition-colors">
                  {formData.image ? (
                    <div className="space-y-3">
                      <img
                        src={formData.image}
                        alt="App icon"
                        className="w-20 h-20 mx-auto rounded-xl object-cover"
                      />
                      <p className="text-sm text-green-400">Image uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gray-700 flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">Upload app icon</p>
                    </div>
                  )}
                  <CldUploadButton
                    uploadPreset="ml_default"
                    className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium text-sm"
                    onSuccess={(result: any) => {
                      const imageUrl = result.info.secure_url;
                      const imagePublicId = result.info.public_id;
                      setFormData((prev) => ({
                        ...prev,
                        image: imageUrl,
                        imagePublicId: imagePublicId,
                      }));
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Icon
                  </CldUploadButton>
                </div>
              </div>

              <div className="relative">
                <label className={labelClasses}>Screenshots</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-500/50 transition-colors">
                  {formData.screenshots.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-center gap-2 flex-wrap">
                        {formData.screenshots.slice(0, 3).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Screenshot ${i + 1}`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-green-400">{formData.screenshots.length} screenshot(s) uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gray-700 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">Upload screenshots</p>
                    </div>
                  )}
                  <CldUploadButton
                    uploadPreset="ml_default"
                    className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium text-sm"
                    onSuccess={(result: any) => {
                      const screenshotsUrl = result.info.secure_url;
                      const ScreenshotsPublicIds = result.info.public_id;
                      setFormData((prev) => ({
                        ...prev,
                        screenshots: [...prev.screenshots, screenshotsUrl],
                        screenshotsPublicIds: [...prev.screenshotsPublicIds, ScreenshotsPublicIds],
                      }));
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Screenshots
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4 pb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-semibold text-lg shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create App
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
