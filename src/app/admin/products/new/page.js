'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, Loader2 } from 'lucide-react';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: 'resin-keychains',
    tags: '',
    featured: false,
    bestseller: false,
    inStock: true,
    images: [],
    customizationOptions: []
  });

  const categories = [
    { label: 'Resin Keychains', value: 'resin-keychains' },
    { label: 'Resin Jewelry', value: 'resin-jewelry' },
    { label: 'Resin Photo Frames', value: 'resin-photo-frames' },
    { label: 'Resin Nameplates', value: 'resin-nameplates' },
    { label: 'Custom Items', value: 'custom-items' },
    { label: 'Festival Special', value: 'festival-special' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addCustomizationOption = () => {
    setFormData(prev => ({
      ...prev,
      customizationOptions: [
        ...prev.customizationOptions,
        { name: '', type: 'text', required: false, options: '' }
      ]
    }));
  };

  const updateCustomizationOption = (index, field, value) => {
    const newOptions = [...formData.customizationOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData(prev => ({ ...prev, customizationOptions: newOptions }));
  };

  const removeCustomizationOption = (index) => {
    setFormData(prev => ({
      ...prev,
      customizationOptions: prev.customizationOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process tags and options before sending
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        customizationOptions: formData.customizationOptions.map(opt => ({
          ...opt,
          options: opt.type === 'select' ? opt.options.split(',').map(o => o.trim()) : undefined
        }))
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        alert('Product created successfully! 🎉');
        router.push('/admin/products');
        router.refresh();
      } else {
        alert(resData.error || 'Failed to create product. Please check form details.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.message || 'An error occurred while creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" min="0" value={formData.discountPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500">
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" placeholder="resin, keychain, gold" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Images</h2>
          
          <div className="flex flex-wrap gap-4 items-center">
            {formData.images.map((img, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={typeof img === 'string' ? img : img.url} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className={`w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-violet-600 hover:border-violet-300 cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploadingImage ? (
                <>
                  <Loader2 className="w-6 h-6 mb-1 animate-spin text-violet-600" />
                  <span className="text-[11px] font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Upload File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </>
              )}
            </label>
          </div>

          <div className="flex gap-2 items-center pt-2">
            <input
              type="url"
              placeholder="Or enter direct image URL (https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => {
                if (imageUrlInput.trim()) {
                  setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
                  setImageUrlInput('');
                }
              }}
              className="px-3 py-1.5 text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 rounded-md font-medium cursor-pointer"
            >
              + Add Image URL
            </button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">Customization Options</h2>
            <button type="button" onClick={addCustomizationOption} className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium">
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.customizationOptions.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No customization options added.</p>
            ) : (
              formData.customizationOptions.map((opt, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <button type="button" onClick={() => removeCustomizationOption(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                      <input type="text" value={opt.name} onChange={(e) => updateCustomizationOption(index, 'name', e.target.value)} placeholder="e.g. Add Name" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select value={opt.type} onChange={(e) => updateCustomizationOption(index, 'type', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded">
                        <option value="text">Text Input</option>
                        <option value="select">Dropdown Options</option>
                        <option value="color">Color Picker</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={opt.required} onChange={(e) => updateCustomizationOption(index, 'required', e.target.checked)} className="rounded text-violet-600 focus:ring-violet-500" />
                        <span className="text-sm font-medium text-gray-700">Required Field</span>
                      </label>
                    </div>
                    {opt.type === 'select' && (
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Options (comma separated)</label>
                        <input type="text" value={opt.options} onChange={(e) => updateCustomizationOption(index, 'options', e.target.value)} placeholder="Gold flakes, Silver flakes, Rose Gold" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status & Toggles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Product Status</h2>
          
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-medium text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-medium text-gray-700">Featured (Show on homepage)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-medium text-gray-700">Bestseller Badge</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 font-medium transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

