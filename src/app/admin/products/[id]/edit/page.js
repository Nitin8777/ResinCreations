'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, Plus, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const id = params.id;
    if (id) {
      fetchProduct(id);
    }
  }, [params.id]);

  const fetchProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      if (data.product) {
        const product = data.product;
        const normalizedImages = product.images?.map(img => 
          typeof img === 'string' ? img : (img?.url || '')
        ).filter(Boolean) || [];

        setFormData({
          ...product,
          images: normalizedImages,
          tags: product.tags ? product.tags.join(', ') : '',
          customizationOptions: product.customizationOptions?.map(opt => ({
            ...opt,
            options: Array.isArray(opt.options) ? opt.options.join(', ') : opt.options || ''
          })) || []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

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
          images: [...(prev.images || []), data.url]
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
        ...(prev.customizationOptions || []),
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
    setSaving(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        images: formData.images,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
        customizationOptions: (formData.customizationOptions || []).map(opt => ({
          ...opt,
          options: opt.type === 'select' && typeof opt.options === 'string' ? opt.options.split(',').map(o => o.trim()) : opt.options
        }))
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        alert('Product updated successfully! 🎉');
        router.push('/admin/products');
        router.refresh();
      } else {
        alert(resData.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <p className="text-gray-500 text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!formData) return <div className="p-8 text-center text-gray-500">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product: {formData.name}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2 text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input type="text" name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea name="description" required rows={4} value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" name="price" required min="0" value={formData.price ?? ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" min="0" value={formData.discountPrice ?? ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category || 'resin-keychains'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500">
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" placeholder="resin, keychain, gold" value={formData.tags || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500" />
            </div>
          </div>
        </div>

        {/* Photos & Images Management */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Product Photos</h2>
              <p className="text-xs text-gray-500">Upload new photos, delete old ones, or add image links directly.</p>
            </div>
            <span className="text-xs font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
              {(formData.images || []).length} Photos
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center pt-2">
            {(formData.images || []).map((img, index) => {
              const srcUrl = typeof img === 'string' ? img : (img?.url || '/images/placeholder.svg');
              return (
                <div key={index} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-violet-100 shadow-sm group">
                  <img src={srcUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)} 
                    className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition"
                    title="Remove Photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    #{index + 1}
                  </span>
                </div>
              );
            })}
            
            {/* Upload Button */}
            <label className={`w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-violet-600 hover:border-violet-300 cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploadingImage ? (
                <>
                  <Loader2 className="w-6 h-6 mb-1 animate-spin text-violet-600" />
                  <span className="text-[11px] font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-semibold">Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </>
              )}
            </label>
          </div>

          {/* Direct URL Input */}
          <div className="flex gap-2 items-center pt-3 border-t border-gray-100 mt-2">
            <input
              type="url"
              placeholder="Or enter direct photo URL (https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => {
                if (imageUrlInput.trim()) {
                  setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageUrlInput.trim()] }));
                  setImageUrlInput('');
                }
              }}
              className="px-4 py-2 text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 rounded-xl font-bold cursor-pointer transition"
            >
              + Add Photo URL
            </button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Customization Options</h2>
              <p className="text-xs text-gray-500">Allow customers to enter name, text, or choose options for this item.</p>
            </div>
            <button type="button" onClick={addCustomizationOption} className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 font-semibold cursor-pointer">
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>
          
          <div className="space-y-4">
            {(!formData.customizationOptions || formData.customizationOptions.length === 0) ? (
              <p className="text-sm text-gray-400 italic">No customization options added for this product.</p>
            ) : (
              formData.customizationOptions.map((opt, index) => (
                <div key={index} className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 relative">
                  <button type="button" onClick={() => removeCustomizationOption(index)} className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 p-1">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                      <input type="text" value={opt.name || ''} onChange={(e) => updateCustomizationOption(index, 'name', e.target.value)} placeholder="e.g. Enter Name" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select value={opt.type || 'text'} onChange={(e) => updateCustomizationOption(index, 'type', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white">
                        <option value="text">Text Input</option>
                        <option value="select">Dropdown Options</option>
                        <option value="color">Color Picker</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!opt.required} onChange={(e) => updateCustomizationOption(index, 'required', e.target.checked)} className="rounded text-violet-600 focus:ring-violet-500" />
                        <span className="text-xs font-medium text-gray-700">Required Field</span>
                      </label>
                    </div>
                    {opt.type === 'select' && (
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Dropdown Options (comma separated)</label>
                        <input type="text" value={opt.options || ''} onChange={(e) => updateCustomizationOption(index, 'options', e.target.value)} placeholder="Option 1, Option 2, Option 3" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status & Toggles */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-900">Product Status</h2>
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="inStock" checked={!!formData.inStock} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-semibold text-gray-700 text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={!!formData.featured} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-semibold text-gray-700 text-sm">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="bestseller" checked={!!formData.bestseller} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
              <span className="font-semibold text-gray-700 text-sm">Bestseller Badge</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-7 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-bold transition-colors disabled:opacity-50 shadow-md cursor-pointer">
            {saving ? 'Updating Product...' : 'Save & Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

