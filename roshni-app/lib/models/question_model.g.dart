// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'question_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class QuestionAdapter extends TypeAdapter<Question> {
  @override
  final int typeId = 1;

  @override
  Question read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Question(
      questionID: fields[0] as String,
      testID: fields[1] as String,
      text: fields[2] as String,
      type: fields[3] as String,
      correct: fields[4] as dynamic,
      difficulty: fields[5] as String,
      options: (fields[6] as List).cast<dynamic>(),
      useranswer: fields[7] as String?,
    )
      ..img = fields[8] as String?
      ..marks = fields[9] as int?;
  }

  @override
  void write(BinaryWriter writer, Question obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.questionID)
      ..writeByte(1)
      ..write(obj.testID)
      ..writeByte(2)
      ..write(obj.text)
      ..writeByte(3)
      ..write(obj.type)
      ..writeByte(4)
      ..write(obj.correct)
      ..writeByte(5)
      ..write(obj.difficulty)
      ..writeByte(6)
      ..write(obj.options)
      ..writeByte(7)
      ..write(obj.useranswer)
      ..writeByte(8)
      ..write(obj.img)
      ..writeByte(9)
      ..write(obj.marks)
      ..writeByte(10)
      ..write(obj.key);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is QuestionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
