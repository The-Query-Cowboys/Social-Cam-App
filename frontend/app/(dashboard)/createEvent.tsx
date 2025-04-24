import { StyleSheet, Text, View, Button, Platform, TextInput, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from "@/context/ThemeContext";
import icon from '../../assets/favicon.png';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

import { createEvent as postEventApi } from '../api/api'
import useApiRequest from '../../reuseable/apiRequest';

import { uploadImageToAppwrite } from '../../appwrite/appwrite.api';

import axios from 'axios';

interface EventData {
  event_owner_id: number;
  event_title: string;
  event_description: string;
  album_id: number;
  storage_id: string;
  event_location: string;
  album_delay: number;
  private: boolean;
  event_date: string;
  event_date_end: string;
}

const createEvent = () => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`;

  const [formData, setFormData] = useState<EventData>({
    event_owner_id: 0,
    event_title: '',
    event_description: '',
    album_id: 1,
    storage_id: '',
    event_location: '',
    album_delay: 0,
    private: false,
    event_date: "",
    event_date_end: ""
  });

  const { user } = useUser();

  useEffect(() => {
    if (user?.user_id) {
      setFormData((prev: EventData) => ({
        ...prev,
        event_owner_id: user.user_id
      }));
    }
  }, [user]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startText, setStartText] = useState('Not selected yet');
  const [endText, setEndText] = useState('Not selected yet');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false)

  const pickImage = async (mode: string) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.
          requestMediaLibraryPermissionsAsync()
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri)
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const createEventApi = async (eventData: EventData) => {
    return axios.post('/api/events', eventData);
  };


  const handleInputChange = (field: keyof EventData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;

    if (event.type === 'set') {
      setStartDate(currentDate);
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
      setStartText(`${fDate} + '\n' + ${fTime}`);
      setFormData(prev => ({
        ...prev,
        event_date: currentDate.toISOString()
      }));
    }

    setShowStartDatePicker(false);
    setShowStartTimePicker(false);
  };

  const handleEndDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;

    if (event.type === 'set') {
      setEndDate(currentDate);
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
      setEndText(`${fDate} + '\n' + ${fTime}`);
      setFormData(prev => ({
        ...prev,
        event_date_end: currentDate.toISOString()
      }));
    }

    setShowEndDatePicker(false);
    setShowEndTimePicker(false);
  };

  const uploadUri = async () => {
    if (!selectedImage) {
      alert("Theres a problem, no selectedImage is passed")
      return
    }
    if (selectedImage) {
      const result = await uploadImageToAppwrite(selectedImage)
      console.log(result.$id, "<<<< result.$id")
      return result.$id
    }
  }

  const handleSubmit = async (selectedImage: string) => {
    if (!user?.user_id) {
      alert("Please log in to create an event");
      return;
    }

    if (new Date(formData.event_date_end) <= new Date(formData.event_date)) {
      alert("End date and time must be after the start date and time.");
      return;
    }

    if (formData.event_title && formData.event_location && formData.event_date && formData.event_description && formData.event_date_end && selectedImage) {
      const storage_Id = await uploadUri()
      const eventData = {
        event_owner_id: user.user_id,
        event_title: formData.event_title,
        event_description: formData.event_description,
        storage_id: storage_Id,
        event_location: formData.event_location,
        album_delay: 0,
        private: formData.private,
        event_date: formData.event_date,
        event_date_end: formData.event_date_end
      }
      const postedEvent = postEventApi(eventData)
      console.log(postedEvent, "<<< postedevent")
      alert(`Event ${eventData.event_title} is created !`)
    } else {
      alert("fill in all the forms!")
      return
    }
  };

  return (
    <View className={`flex-1 justify-center items-center ${applyTheme}`}>


      <Text className={`${applyTheme} font-bold text-lg `}>Event title</Text>
      <TextInput
        className='w-[95%]  border-2 border-black rounded p-4 rounded mb-1'
        placeholder='Event title'
        placeholderTextColor="#666"
        value={formData.event_title}
        onChangeText={(value) => handleInputChange('event_title', value)}
      />

      <Text className={`${applyTheme} font-bold text-lg `}>Event Description</Text>
      <TextInput
        className='w-[95%]  border-2 border-black rounded p-4 rounded mb-1'
        placeholder='Event description'
        placeholderTextColor="#666"
        value={formData.event_description}
        onChangeText={(value) => handleInputChange('event_description', value)}
        multiline
        numberOfLines={4}
      />

      <Text className={`${applyTheme} font-bold text-lg `}>Event Location</Text>
      <TextInput
        className='w-[95%] border-2 border-black rounded p-4 rounded mb-1'
        placeholder='Event location'
        placeholderTextColor="#666"
        value={formData.event_location}
        onChangeText={(value) => handleInputChange('event_location', value)}
      />


      <Text className={`${applyTheme} font-bold text-lg `}>Event Date and Time</Text>
      {/* starting View*/}
      <View className={`w-full flex-row space-x-10  justify-between items-center ${applyTheme}`}>
        {/* second layer View start-date*/}
        <View className={`mx-10 justify-between items-center ${applyTheme}`}>
          <Text className={`${applyTheme} font-bold text-md mb-1`}>Start Date & Time</Text>
            {/* Third layer View TouchOpacity*/} 
            <View className="flex-row space-x-1 mb-2">
              {/*Add theme button css */}
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded h-10 "
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded h-10 "
                onPress={() => setShowStartTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          {showStartDatePicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateTimeChange}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              testID="startTimePicker"
              value={startDate}
              mode="time"
              display="default"
              onChange={handleStartDateTimeChange}
              />
            )}
          <Text className={`${applyTheme} text-md mt-5`}>{startText}</Text>
        </View>

        {/* second layer View end-date*/} 
        <View className={`justify-between items-center ${applyTheme}`}>
            <Text className={`${applyTheme} font-bold text-md mb-1`}>End Date & Time</Text>
          {/* Third layer View end-date*/} 
          <View className="flex-row space-x-1 mb-2">
            {/*Add theme button css */}
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded h-10 "
                onPress={() => setShowEndDatePicker(true)}
              >
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded h-10 "
                onPress={() => setShowEndTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color="white" />
              </TouchableOpacity>
          </View>

          {showEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateTimeChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              testID="endTimePicker"
              value={endDate}
              mode="time"
              display="default"
              onChange={handleEndDateTimeChange}
            />
          )}

          <Text className={`${applyTheme} text-md mt-5`}>{endText}</Text>
        </View>
      </View>

      <View className={`flex-row justify-center items-center ${applyTheme}`}>
        <Text className={`${applyTheme} font-bold text-lg `}>Upload Event Image</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded "
          onPress={() => { pickImage("gallery") }}
        >
          <Text className="text-white">Select Image</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage }}
          className="w-32 h-32 rounded mt-2"
        />
      </View>

      <View className="flex-row items-center ">
        <Text className={`${applyTheme} font-bold text-lg mr-2`}>Private Event:</Text>
        <TouchableOpacity
          className={`p-2 rounded ${formData.private ? 'bg-blue-500' : 'bg-gray-300'}`}
          onPress={() => setFormData(prev => ({ ...prev, private: !prev.private }))}
        >
          <Text className="text-white">{formData.private ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className=' w-4/5 p-2 bg-green-200 border border-gray-300 rounded items-center'
        onPress={handleSubmit}
      >
        <Text className='text-black'>{isPosting ? 'Creating...' : 'Create'}</Text>
      </TouchableOpacity>

      <View className={`flex-row mt-2 mx-10 ${applyTheme}`}>
        <Link href='/' className='my-1 text-white'>Home</Link>
        <Link href='/publicEventPage' className='my-1 text-white'>Event Page</Link>
      </View>
    </View>
  );
};

export default createEvent;