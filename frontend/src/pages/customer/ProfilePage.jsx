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
    <div className="min-h-screen bg-[#0f0f0f] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-medium text-[#f5f0e8] mb-8">My Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6 space-y-6">
          <div className="border-b border-[#2e2e2e] pb-6">
            <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Personal Information</h2>
            <div className="space-y-4">
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

          <div className="pb-6">
            <h2 className="text-lg font-medium text-[#f5f0e8] mb-4">Change Password</h2>
            <div className="space-y-4">
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