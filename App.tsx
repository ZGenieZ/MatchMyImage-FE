import React from 'react';
import { Button, SafeAreaView } from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <Button title="카카오 로그인" />
      <Button
        title="구글 로그인(구현 예정)"
        onPress={() => {
          console.log('구글');
        }}
      />
      <Button title="애플 로그인(구현 예정)" />
    </SafeAreaView>
  );
}

export default App;
