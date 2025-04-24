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
  const { colorScheme, isDark } = useTheme();
  const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-background-dark' : 'text-black bg-background-light'}`;
  const inputTextStyle = colorScheme === 'dark' ? "text-text-dark border-border-light" : "text-text-light border-border-dark";
  const opacityStyle = colorScheme === 'dark' ? "text-text-dark bg-secondary-dark" : "text-text-light bg-secondary-light";
  const styles = {
    header: {
      container: "p-4 flex-row justify-between items-center border-b",
      border: isDark ? "border-primary-dark" : "border-primary-light",
      title: `text-xl font-bold ${isDark ? "text-foreground-dark" : "text-primary-light"
        }`,
      homeLink: `py-2 font-bold ${isDark ? "text-foreground-dark" : "text-primary-light"
        }`,
      tabContainer: "flex-row rounded-lg overflow-hidden",
      tab: `py-2 px-4`,
      activeTab: isDark ? "bg-primary-dark" : "bg-surface-light",
      inactiveTab: isDark ? "bg-gray-700" : "bg-gray-200",
      activeTabText: isDark
        ? "text-background-dark font-bold"
        : "text-foreground-light font-bold",
      inactiveTabText: isDark ? "text-gray-300" : "text-gray-600",
    },
  }

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
      setStartText(`Date is ${fDate}\nTime is ${fTime}`);
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
      setEndText(`Date is ${fDate}\nTime is ${fTime}`);
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
      alert(`Event ${eventData.event_title} is created !`)
    } else {
      alert("fill in all the forms!")
      return
    }
  };

  return (
    <SafeAreaView className={`flex-1  ${applyTheme}`}>
      <View className={`${styles.header.container} ${styles.header.border}`}>
        <Link href="/" className={styles.header.homeLink}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDark ? "#F65275" : "#1F2937"}
          />
        </Link>
        <Text className={styles.header.title}>Create Event</Text>
      </View>
      {/**start View form*/}
      <View className='justify-center items-center my-15 '>
        <Text className={`${applyTheme} font-bold text-lg `}>Event title</Text>
        <TextInput
          className={` ${inputTextStyle} w-[95%] border-2 rounded p-4 rounded mb-1`}
          placeholder='Event title'
          placeholderTextColor="#666"
          value={formData.event_title}
          onChangeText={(value) => handleInputChange('event_title', value)}
        />

        <Text className={`${applyTheme} font-bold text-lg `}>Event Description</Text>
        <TextInput
          className={` ${inputTextStyle} w-[95%] border-2 rounded p-4 rounded mb-1`}
          placeholder='Event description'
          placeholderTextColor="#666"
          value={formData.event_description}
          onChangeText={(value) => handleInputChange('event_description', value)}
          multiline
          numberOfLines={4}
        />

        <Text className={`${applyTheme} font-bold text-lg `}>Event Location</Text>
        <TextInput
          className={` ${inputTextStyle} w-[95%] border-2 rounded p-4 rounded mb-1`}
          placeholder='Event location'
          placeholderTextColor="#666"
          value={formData.event_location}
          onChangeText={(value) => handleInputChange('event_location', value)}
        />


        {/* starting View*/}
        <Text className={`${applyTheme} font-bold text-lg `}>Event Date and Time</Text>
        <View className={`w-full flex-row space-x-200 justify-between  items-center ${applyTheme}`}>
          {/* second layer View start-date*/}
          <View className={` justify-between items-center ${applyTheme}`}>
            <Text className={`${applyTheme} font-bold text-md mb-1`}>Start Date & Time</Text>
            {/* Third layer View TouchOpacity*/}
            <View className="flex-row space-x-1 mb-2">
              {/*Add theme button css */}
              <TouchableOpacity
                className={`px-4 py-2 rounded h-15 w-15 justify-center ${opacityStyle}`}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={25} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded h-15 w-15 justify-center ${opacityStyle}`}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Ionicons name="time-outline" size={25} color="white" />
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
                className={`px-4 py-2 rounded h-15 w-15 justify-center ${opacityStyle}`}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={25} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded h-15 w-15 justify-center ${opacityStyle}`}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Ionicons name="time-outline" size={25} color="white" />
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
            className= {` ${opacityStyle} px-4 py-2 rounded`}
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
            className={`0 p-2 rounded ${formData.private ? opacityStyle : opacityStyle }`}
            onPress={() => setFormData(prev => ({ ...prev, private: !prev.private }))}
          >
            <Text className="text-white">{formData.private ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`${opacityStyle} w-4/5 p-2 bg-green-200 border border-gray-300 rounded items-center`}
          onPress={handleSubmit}
        >
          <Text className='text-black'>{isPosting ? 'Creating...' : 'Create'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default createEvent;