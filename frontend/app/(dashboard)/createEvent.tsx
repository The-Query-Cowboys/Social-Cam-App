import { StyleSheet, Text, View, Button, Platform, TextInput, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from "@/context/ThemeContext";
// @ts-ignore
import icon from '../../assets/favicon.png';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import useApiRequest from '../reuseable/apiRequest';
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
    event_owner_id: 1,
    event_title: '',
    event_description: '',
    album_id: 1,
    storage_id: '',
    event_location: '',
    album_delay: 0,
    private: false,
    event_date: new Date().toISOString(),
    event_date_end: new Date().toISOString()
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startText, setStartText] = useState('No start date and time selected yet');
  const [endText, setEndText] = useState('No end date and time selected yet');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const pickImage = async () => {
    if (!permissionResponse?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        alert('Permission to access media library is required!');
        return;
      }
    }

    try {
      const result = await MediaLibrary.launchImageLibraryAsync({
        mediaTypes: MediaLibrary.MediaType.photo,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setFormData(prev => ({
          ...prev,
          storage_id: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image. Please try again.');
    }
  };

  const createEventApi = async (eventData: EventData) => {
    return axios.post('/api/events', eventData);
  };

  const { isLoading, isError, data } = useApiRequest(createEventApi, 'event', formData);


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
      setStartText('Selected start date and time is:\n' + fDate + '\n' + fTime);
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
      setEndText('Selected end date and time is:\n' + fDate + '\n' + fTime);
      setFormData(prev => ({
        ...prev,
        event_date_end: currentDate.toISOString()
      }));
    }

    setShowEndDatePicker(false);
    setShowEndTimePicker(false);
  };

  const handleSubmit = () => {
    if (!formData.event_title || !formData.event_location || !formData.event_date || !formData.event_description || !formData.event_date_end  ) {
      alert('Please fill in all required fields');
      return;
    }
  };

  return (
    <View className={`flex-1 justify-center items-center ${applyTheme}`}>
      {/* <Text className={`${applyTheme} text-lg mb-1`}>Create new event </Text> */}

      {/* <Text className={`${applyTheme} font-bold text-lg mb-1`}>Event Title</Text> */}
      <TextInput
        className='w-full border-2 border-black rounded p-4 rounded my-2'
        placeholder='Event title'
        placeholderTextColor="#666"
        value={formData.event_title}
        onChangeText={(value) => handleInputChange('event_title', value)}
      />

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Event Description</Text>
      <TextInput
        className='w-full border-2 border-black rounded p-4 rounded my-2'
        placeholder='Event description'
        placeholderTextColor="#666"
        value={formData.event_description}
        onChangeText={(value) => handleInputChange('event_description', value)}
        multiline
        numberOfLines={4}
      />

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Event Location</Text>
      <TextInput
        className='w-full border-2 border-black rounded p-4 rounded my-2'
        placeholder='Event location'
        placeholderTextColor="#666"
        value={formData.event_location}
        onChangeText={(value) => handleInputChange('event_location', value)}
      />

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Select start date and time for your event!</Text>
      <View className="flex-row space-x-4 mb-1">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text className="text-white">Select Start Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text className="text-white">Select Start Time</Text>
        </TouchableOpacity>
      </View>
      <Text className={`${applyTheme} text-lg mb-1`}>{startText}</Text>

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Select end date and time for your event!</Text>
      <View className="flex-row space-x-4 mb-1">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text className="text-white">Select End Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text className="text-white">Select End Time</Text>
        </TouchableOpacity>
      </View>
      <Text className={`${applyTheme} text-lg mb-1`}>{endText}</Text>

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


      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          className="w-32 h-32 rounded mt-2"
        />
      )}

