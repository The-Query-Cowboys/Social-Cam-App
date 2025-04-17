import { StyleSheet, Text, View, Button, Platform, TextInput, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from "@/context/ThemeContext";
import icon from '../../assets/favicon.png';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from 'react';
import * as MediaLibrary from 'expo-media-library';


const createEvent = () => {
  const { colorScheme } = useTheme()
  const applyTheme = `${colorScheme === 'dark' ? 'text-white bg-black' : 'text-black bg-white'}`

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [text, setText] = useState('No date and time selected yet , click the \'select date\'and \'select time\'button above and select from a date/time picker ');


  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();



  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    if (event.type === 'set') {
      setDate(currentDate);
      let tempDate = new Date(currentDate);
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
      let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
      setText('Selected date and time is:\n' + fDate + '\n' + fTime);
    }

    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  return (
    <View className={`flex-1 justify-center items-center bg-black ${applyTheme}`}>
      <Image className='mb-4' source={icon} alt="temp icon" />
      <Text className={`${applyTheme} text-lg mb-4`}>Create new event </Text>

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Event title</Text>
      <TextInput
        className='w-full border-2 border-black rounded p-4 rounded my-2'
        placeholder='Event title'
        placeholderTextColor="#666" />

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Event location address</Text>
      <TextInput
        className='w-full border-2 border-black rounded p-4 rounded my-2'
        placeholder='address'
        placeholderTextColor="#666" />

      <Text className={`${applyTheme} font-bold text-lg mb-1`}>Select a date and time for your event!</Text>
      <View className="flex-row space-x-4 mb-4">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={showDatepicker}
        >
          <Text className="text-white">Select Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={showTimepicker}
        >
          <Text className="text-white">Select Time</Text>
        </TouchableOpacity>
      </View>
      <Text className={`${applyTheme} text-lg mb-4`}>{text}</Text>

      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={date}
          mode="time"
          display="default"
          onChange={onChange}
        />
      )}

      <Text className='items-start font-bold text-lg mb-1'>Upload an image for your event!</Text>
      <TextInput
        className='w-full border-2 border-black rounded p-4 my-2'
        placeholder='image_url'
        placeholderTextColor="#666" />



      <TouchableOpacity className='w-4/5 p-2 bg-green-200 border border-gray-300 rounded items-center'>
        <Text className='text-black'>Create</Text>
      </TouchableOpacity>



      <Link href='/' className='my-4'>Home</Link>
      <Link href='/publicEventPage' className='my-4'>Event Page</Link>
    </View>
  )
}

export default createEvent

const styles = StyleSheet.create({})