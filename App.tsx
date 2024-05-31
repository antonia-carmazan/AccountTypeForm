import React from 'react';
import {Button, TextInput, Text, View, StyleSheet} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';

const validationSchema = Yup.object().shape({
  accountType: Yup.string()
    .oneOf(['Advanced', 'Manual'], 'Invalid Account Type')
    .required('Required'),
  username: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  serverAddress: Yup.string().required('Required'),
  serverPath: Yup.string().when('accountType', (accountType, schema) => {
    return accountType === 'Advanced' ? schema.required('Required') : schema;
  }),
  port: Yup.number().when('accountType', (accountType, schema) => {
    return accountType === 'Advanced'
      ? schema
          .min(1, 'Port number must be between 1 and 65535')
          .max(65535, 'Port number must be between 1 and 65535')
          .required('Required')
      : schema;
  }),
});

const App = () => {
  const formik = useFormik({
    initialValues: {
      accountType: '',
      username: '',
      password: '',
      serverAddress: '',
      serverPath: '',
      port: '',
      useSSL: false,
    },
    validationSchema,
    onSubmit: values => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account Type:</Text>
      <Picker
        selectedValue={formik.values.accountType}
        onValueChange={itemValue =>
          formik.setFieldValue('accountType', itemValue)
        }>
        <Picker.Item label="Select Account Type" value="" />
        <Picker.Item label="Advanced" value="Advanced" />
        <Picker.Item label="Manual" value="Manual" />
      </Picker>
      {formik.errors.accountType && (
        <Text style={styles.errorText}>{formik.errors.accountType}</Text>
      )}
      <Text style={styles.label}>User Name:</Text>
      <TextInput
        style={[styles.input, formik.errors.username && {borderColor: 'red'}]}
        placeholder="name@example.com"
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
        secureTextEntry={false}
      />
      {formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={[styles.input, formik.errors.password && {borderColor: 'red'}]}
        placeholder="Required"
        onChangeText={formik.handleChange('password')}
        value={formik.values.password}
        secureTextEntry
      />
      {formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}
      <Text style={styles.label}>Server Address:</Text>
      <TextInput
        style={[
          styles.input,
          formik.errors.serverAddress && {borderColor: 'red'},
        ]}
        placeholder="example.com"
        onChangeText={formik.handleChange('serverAddress')}
        value={formik.values.serverAddress}
      />
      {formik.errors.serverAddress && (
        <Text style={styles.errorText}>{formik.errors.serverAddress}</Text>
      )}
      {formik.values.accountType === 'Advanced' && (
        <>
          <Text style={styles.label}>Server Path:</Text>
          <TextInput
            style={[
              styles.input,
              formik.errors.serverPath && {borderColor: 'red'},
            ]}
            placeholder="/calendars/users"
            onChangeText={formik.handleChange('serverPath')}
            value={formik.values.serverPath}
          />
          {formik.errors.serverPath && (
            <Text style={styles.errorText}>{formik.errors.serverPath}</Text>
          )}
          <Text style={styles.label}>Port:</Text>
          <TextInput
            style={[styles.input, formik.errors.port && {borderColor: 'red'}]}
            placeholder=""
            onChangeText={value =>
              formik.setFieldValue('port', parseInt(value))
            }
            value={formik.values.port.toString()}
            keyboardType="numeric"
          />
          {formik.errors.port && (
            <Text style={styles.errorText}>{formik.errors.port}</Text>
          )}
        </>
      )}
      <Button
        title={formik.values.useSSL ? 'Use SSL: ON' : 'Use SSL: OFF'}
        onPress={() => formik.setFieldValue('useSSL', !formik.values.useSSL)}
      />
      <Button title="Submit" onPress={formik.handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
  },
});

export default App;
