// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'test_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class TestAdapter extends TypeAdapter<Test> {
  @override
  final int typeId = 0;

  @override
  Test read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Test(
      createDate: fields[0] as String,
      expiry: fields[1] as String,
      imageUrl: fields[2] as String,
      questions: (fields[3] as List).cast<dynamic>(),
      subject: fields[4] as String,
      testID: fields[5] as String,
      time: fields[6] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Test obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.createDate)
      ..writeByte(1)
      ..write(obj.expiry)
      ..writeByte(2)
      ..write(obj.imageUrl)
      ..writeByte(3)
      ..write(obj.questions)
      ..writeByte(4)
      ..write(obj.subject)
      ..writeByte(5)
      ..write(obj.testID)
      ..writeByte(6)
      ..write(obj.time)
      ..writeByte(7)
      ..write(obj.key);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TestAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
