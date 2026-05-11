import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profile updated:', data);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#f8f4ef]">My Profile</h1>
          <p className="text-[#6b6b6b] mt-1">Manage your account settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-2xl p-8 space-y-8">
          <div className="border-b border-[#2a2a2e] pb-8">
            <h2 className="font-display text-lg text-[#f8f4ef] mb-6">Personal Information</h2>
            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                error={errors.email?.message}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+44 1234 567890"
                {...register('phone')}
              />
            </div>
          </div>

          <div className="pb-8">
            <h2 className="font-display text-lg text-[#f8f4ef] mb-6">Change Password</h2>
            <div className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                {...register('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                {...register('newPassword', {
                  minLength: { value: 8, message: 'Min 8 characters' }
                })}
                error={errors.newPassword?.message}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                {...register('confirmPassword', {
                  validate: (value, formValues) =>
                    value === formValues.newPassword || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;